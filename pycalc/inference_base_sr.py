from os.path import join
import tensorflow as tf
import argument_sr
import net_sr as net
import os
from PIL import Image
import numpy as np

path1 = "./dataset/BSDS300/images/train/"


def change_to_image(path):
    """
    Args:通过路径列表获取 图片
        input_file_path: 输入图像的路径
    Returns:

    """
    im = Image.open(path)
    height = im.size[1]
    width = im.size[0]
    im = im.convert('YCbCr')
    image = np.asarray(im)[:,:,0]/255
    image = tf.convert_to_tensor(np.array(image), dtype=tf.float32)
    print(image)
    image = tf.expand_dims(image,0)
    image = tf.expand_dims(image,3)
    # if path.endswith("jpg") or path.endswith("jpg"):
    #     image =  tf.image.decode_jpeg(content, num_channel)
    # elif path.endswith("png"):
    #     image = tf.image.decode_png(content, num_channel)
    # else :
    #     print("wrong image: "+path)
    #
    # if image is not None:
    #     image = tf.image.convert_image_dtype(image, dtype=tf.float32)
    #     image = tf.reshape(image,(height,width,3))
    #
    #
    # image = tf.reshape(image,(pic_num,height,width,3))
    return [image,height,width]


def save_image(image , path):
    with open(path, "wb") as file:
        file.write(image)


def get_scale_factor(scale):
    """
    Args:
        scale: ori scale

    Returns:
        floor scale
    """
    if scale <= 1:
        return 1
    elif scale <= 2:
        return 2
    elif scale <= 4:
        return 4
    else :
        return 8


def is_already_Save(savePath):
    """ check whether the model exists """
    return os.path.exists(savePath + ".meta")



"""
     单一图像的预测
"""


def predict_single(input_image,path,scale, out_height, out_width):
    """
        tensorflow op, process the input files in input_images
        return predicted 2x, 4x, 8x images
    """
    argument_sr.options.predict(1)
    factor = get_scale_factor(scale)

    hr2_predict, hr4_predict,hr8_predict = net.get_LasSRN(input_image)

    """
        determine the floor picture
    """
    if factor == 1:
        print('dsf')
        image = input_image
    elif factor == 2:
        image = hr2_predict
    elif factor == 4:
        image = hr4_predict



    """
        resize to the real
    """

    image = tf.image.resize_images(image[0], [out_height, out_width], method=tf.image.ResizeMethod.BICUBIC)
    image = tf.image.convert_image_dtype(image, dtype=tf.uint8)
    print(image)

    return image[:,:,0]


"""
   Prediction API
"""


def single_inference(input_file_path, output_dir_path, scale, out_height, out_width):
    """
    Args:
        input_file_paths:  输入的路径paths
        output_dir_paths:  输出的路径paths
        scale_list:   [list]    1-8 resume   size same with input

    Returns:

    """
    save_path = join(argument_sr.options.save_path, argument_sr.options.model_name + ".ckpt")
    if not is_already_Save(save_path):
        return "!ERROR: no model please train a model first"

    input_images,height,width = change_to_image(input_file_path)
    hr_predict = predict_single(input_images, input_file_path, scale, out_height, out_width)


    saver = tf.train.Saver()
    result = []

    im = Image.open(input_file_path)
    im = im.convert('YCbCr')
    # print(np.asarray(im)[:,:,2])
    im = im.resize((out_width,out_height),Image.BICUBIC)


    U = np.asarray(im)[:,:,1]
    V = np.asarray(im)[:, :,2]


    result = np.zeros([out_height,out_width,3])
    # result[:,:,1] = cr
    # result[:,:,2] = cb

    with tf.Session() as sess:
        checkpoint = tf.train.latest_checkpoint(argument_sr.options.save_path)
        saver.restore(sess, save_path)
        # sess.run(tf.global_variables_initializer())
        with tf.device('/cpu:0'):
            Y = sess.run(hr_predict)

            nd128 = np.ndarray([out_height,out_width],dtype='int')
            for i in range(out_height):
                for j in range(out_width):
                    nd128[i][j] = 128
            # print(V)
            # print(V-nd128)
            R =  Y + 1.4075 *(V-nd128)
            G = Y-0.3455 *(U-nd128)-0.7169 *(V-nd128)
            B = Y + 1.779 *(U-nd128)

            image = np.ndarray([out_height,out_width,3])
            image[:,:,0] = R
            image[:, :, 1] = G
            image[:, :, 2] = B
            r = Image.fromarray(R).convert('L')
            g = Image.fromarray(G).convert('L')
            b = Image.fromarray(B).convert('L')
            result = Image.merge("RGB", (r, g, b))

            # print(np.array(image,dtype='int'))
            # result = Image.fromarray(np.array(image,dtype='int'))
            # print(np.array(result,dtype='int'))
            # img = Image.fromarray(np.array(result,dtype='int'),)
            result.save(output_dir_path)

    tf.reset_default_graph()
    return output_dir_path
