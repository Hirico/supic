from os.path import join
import tensorflow as tf
import argument
import net
import os
from PIL import Image


def change_to_image(path):
    """
    Args:通过路径列表获取 图片
        input_file_path: 输入图像的路径
    Returns:

    """
    im = Image.open(path)
    height = im.size[1]
    width = im.size[0]
    pic_num = 1
    num_channel = argument.options.input_channel
    images = []

    content = tf.read_file(path)
    image = None
    if path.endswith("jpg") or path.endswith("jpg"):
        image =  tf.image.decode_jpeg(content, num_channel)
    elif path.endswith("png"):
        image = tf.image.decode_png(content, num_channel)
    else :
        print("wrong image: "+path)

    if image is not None:
        image = tf.image.convert_image_dtype(image, dtype=tf.float32)
        image = tf.reshape(image,(height,width,3))


    image = tf.reshape(image,(pic_num,height,width,3))
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
    argument.options.predict(1)
    factor = get_scale_factor(scale)
    hr2_predict, hr4_predict, hr8_predict = net.get_LasSRN(input_image)

    """
        determine the floor picture
    """
    if factor == 1:
        image = input_image
    elif factor == 2:
        image = hr2_predict
    elif factor == 4:
        image = hr4_predict
    else:
        image = hr8_predict


    """
        resize to the real
    """

    image = tf.image.resize_images(image[0], [out_height, out_width], method=tf.image.ResizeMethod.BICUBIC)
    image = tf.image.convert_image_dtype(image, dtype=tf.uint8)
    print(image)

    if path.endswith("jpg") or path.endswith("jpg"):
        image = tf.image.encode_jpeg(image)
    elif path.endswith("png"):
        image = tf.image.encode_png(image)
    else:
        print("wrong image: " + path)
        return

    return image


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
    save_path = join(argument.options.save_path, argument.options.model_name + ".ckpt")
    if not is_already_Save(save_path):
        return "no model please train a model first"

    input_images,height,width = change_to_image(input_file_path)
    hr_predict = predict_single(input_images, input_file_path, scale, out_height, out_width)

    saver = tf.train.Saver()
    result = []

    with tf.Session() as sess:
        saver.restore(sess, save_path)
        with tf.device('/cpu:0'):
            hr_img = sess.run(hr_predict)
            save_image(hr_img,output_dir_path)
            return output_dir_path




