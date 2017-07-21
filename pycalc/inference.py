import inference_base

from PIL import Image
import os
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
        return '!ERROR:input_path should be end with JPG, JPEG or PNG'
    if not os.path.exists(input_path):
        return '!ERROR:input_file do not exist: ' + input_path
    if not os.path.exists(output_dir):
        return '!ERROR:output_dir do not exist: ' + output_dir
    scale = 0
    try:
        im = Image.open(input_path)
        height = im.size[1]
        width = im.size[0]
        scale1 = float(out_height) / height
        scale2 = float(out_width) / width
        scale = max(scale1, scale2)
        # TODO this could be change
        if abs(scale1 - scale2) > 1e-2:
            return '!ERROR:image cannot be zoom by different scale parameters'

    except Exception as err:
        return '!ERROR:' + err.args[0]

    name = hex(int(time.time() * 100000))[2:]
    output_path = join(output_dir, name + '.' + iFormat)
    return [scale, output_path]


def predict_SR(input_path, output_dir, out_width, out_height):
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
                 '!ERROR:model error'                                    模型内部错误

    """
    res = _check_parameter(input_path, output_dir, out_height, out_width)
    if res[0] == '!':
        return res
    else:
        try:
            return inference_base.single_inference(input_path, res[1], res[0], out_height, out_width)
        except Exception as err:
            return '!ERROR:model error: ' + str(err)

#print (predict_SR('/home/hirico/supic/resources/icon.png', '/home/hirico/supic_back', 512, 512))
