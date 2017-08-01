import inference_base_sr
from PIL import Image
from os import path
import time
from os.path import join

"""
    Helper functions
"""


def _isImage(path):
    if path.endswith('jpg'):
        return 'jpg'
    if path.endswith('jpeg'):
        return 'jpeg'
    if path.endswith('png'):
        return 'png'
    return False


def _check_parameter(input_path, output_dir, out_height, out_width):
    iFormat = _isImage(input_path)
    if iFormat is False:
        return '!ERROR:input_path should be end with JPG,JPEG or PNG'
    if not path.exists(input_path):
        return '!ERROR:input_file do not exits'
    if not path.exists(output_dir):
        return '!ERROR:output_dir do not exits'
    scale = 0
    try:
        im = Image.open(input_path)
        height = im.size[1]
        width = im.size[0]
        scale1 = out_height / height
        scale2 = out_width / width
        scale = max(scale1, scale2)
        print(scale1,scale2)
        # TODO this could be change
        if abs(scale1 - scale2) > 1e-2:
            return '!ERROR:image cannot be zoom by different scale parameters'

    except Exception as err:
        return '!ERROR:' + err.args[0]

    name = hex(int(time.time() * 100000))[2:]
    output_path = join(output_dir, name + '.' + iFormat)
    return [scale, output_path]


def predict_SR(input_path, output_dir, out_width, out_height, pic_type):
    """
    API

    Args:
        input_path: {String}    读取图片的路径
        output_dir: {String}    保存图片的文件夹
        out_width:  {Number}    处理后图片的宽度
        out_height: {Number}    处理后图片的高
        pic_type: {Number}      图片类型

    Returns:
        {String}
        正常情况下:  返回处理后图像的路径 {String} eg：./test/887b1347e1a2.jpg
        异常情况下:
                 '!ERROR:input_path should be end with JPG,JPEG or PNG'  图像扩展名不是 JPG  JPEG  PNG
                 '!ERROR:input_file do not exits'                        输入图像不存在
                 '!ERROR:output_dir do not exits'                        输出保存的文件夹不存在
                 '!ERROR:cannot identify image file 'xxx/xxx.jpg         读入图像损坏
                 '!ERROR:image cannot be zoom by different scale parameters'  图像长宽方法比例不匹配
                 '!ERROR: model error'                                    模型内部错误

    """
    res = _check_parameter(input_path, output_dir, out_height, out_width)
    if res[0] == '!':
        return res
    else:
        # try:
            return inference_base_sr.single_inference(input_path, res[1], res[0], out_height, out_width)
        #  Exception as err:
        #     return '!ERROR:model error'


def predict_PIL(input_path, output_dir, out_width, out_height):
    """
    API

    Args:
        input_path: {String}    读取图片的路径
        output_dir: {String}    保存图片的文件夹
        out_width:  {Number}    处理后图片的宽度
        out_height: {Number}    处理后图片的高

    Returns:
        {String}
        正常情况下:  返回处理后图像的路径 {String} eg：./test/887b1347e1a2.jpg
        异常情况下:
                 '!ERROR:input_path should be end with JPG,JPEG or PNG'  图像扩展名不是 JPG  JPEG  PNG
                 '!ERROR:input_file do not exits'                        输入图像不存在
                 '!ERROR:output_dir do not exits'                        输出保存的文件夹不存在
                 '!ERROR:cannot identify image file 'xxx/xxx.jpg         读入图像损坏
                 '!ERROR:image cannot be zoom by different scale parameters'  图像长宽方法比例不匹配
                 '!ERROR: model error'                                    模型内部错误

    """
    res = _check_parameter(input_path, output_dir, out_height, out_width)
    if res[0] == '!':
        return res
    else:
        im = Image.open(input_path)
        im = im.resize((out_width,out_height),Image.BICUBIC)
        im.save(res[1])
        return res[1]

if __name__ == '__main__':
    print( 'our::   '+predict_SR('./q.png','./',1200,1200,0))
    #print(' pil::   ' + predict_PIL('./q.png', './', 720, 720,0))
    # print(predict_SR('./psnr/eer.png', './psnr/', 640, 360,0))
