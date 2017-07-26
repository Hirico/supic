# --utf8--#
from os.path import join
from numpy import asarray
from numpy import arange
from random import sample
from PIL import Image

class Argument():
    def __init__(self):

        self.max_log_scale = 2  #模型最大扩大多少倍   如果max_log_scale 为2 是指放大4倍
                                # 如果max_log_scale 为3 是指放大8倍   （在没有这个参数之前默认就是8x模型）


        self.input_channel = 1   #读取图片的通道数量
        self.conv_f = 3          #卷基层的边长
        self.conv_ft = 4         #反卷基层的边长
        self.conv_n = 64         #每一层的通道数（特征个数）
        self.depth = 10           #金字塔每一层深度学习的深度
        self.output_channel = 1  #重建层输出的通道数
        self.height = 128        #输入图像的高度
        self.width = 128        #输入输入的宽度
        self.weight_decay = 1e-4  #权值衰减 (用tensorfow 自己实现的)
        self.save_path = "./sr/"   #保存模型参数的地方
        self.model_name = "superResolution"  #训练模型的名字

    def predict(self,batchsize):
        self.batch_size = batchsize

    def get_image(self, path):
        im = Image.open(path)
        height = im.size[1]
        width = im.size[0]
        mark = False
        if width < height:
            mark = True
            height = width
        if height < self.height:
           return None,None,None

        if mark:
            im = im.rotate(90)

        box = [0,0,self.width,self.height]

        HR4 = im.crop(box)
        HR2 = HR4.resize((int(self.width /2),int(self.height / 2)),Image.BICUBIC)
        LR = HR4.resize((int(self.width / 4), int(self.height / 4)), Image.BICUBIC)
        return asarray(LR.convert('L'))\
            ,asarray(HR2.convert('L')), \
               asarray(HR4.convert('L'))



options = Argument()


