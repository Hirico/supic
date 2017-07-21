# --utf8--#

class Argument():
    def __init__(self):
        self.input_channel = 3   #读取图片的通道数量
        self.conv_f = 3          #卷基层的边长
        self.conv_ft = 4         #反卷基层的边长
        self.conv_n = 64         #每一层的通道数（特征个数）
        self.depth = 7           #金字塔每一层深度学习的深度
        self.output_channel = 3  #重建层输出的通道数
        self.height = 320        #输入图像的高度
        self.width = 320         #输入输入的宽度
        self.batch_size = 16     #每批训练数据的大小
        self.num_threads = 4     #数据导入开启的线程数量
        self.min_after_dequeue = 1024  #保证线程中至少剩下的数据数量
        self.decay = 2          #衰减速率
        self.decay_step = 50    #多少步学习速率衰减一次
        self.lr = 1e-5          #初始化的学习速率
        self.min_lr = 1e-30     #衰减到多少为止
        self.iter_nums = 1000   #迭代次数
        self.momentum = 0.9     #采用动量算法的动量
        self.test_epoches = 20  #测试的迭代周期数
        self.weight_decay = 1e-5  #权值衰减 (用tensorfow 自己实现的)
        self.train_data_path = "./dataset/BSDS300/images/train"  #训练集文件夹的位置
        self.validation_data_path = "./dataset/BSDS300/images/validation"  # 验证集文件夹的位置
        self.test_data_path = "./dataset/BSDS300/images/test"  # 测试集文件夹的位置
        self.save_path = "/home/hirico/supic/pycalc/"   #保存模型参数的地方
        self.model_name = "testModel"  #训练模型的名字

    def predict(self,batchsize):
        self.batch_size = batchsize



options = Argument()
