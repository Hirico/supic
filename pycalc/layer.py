# --utf8--#
import tensorflow as tf

"""
    层级参数 + 是否偏置 + 模型名字 + 超参数
"""


# TODO  函数注释补全

def conv2d(inputs, filter_height, filter_width, output_channels, level, weight_dacay=0, stride=(1, 1), padding='SAME',
           isBias=False,
           name='Conv_2D', bias_constant=0, stddev_norm=0):
    """
    tensorflow 的代码  用torch的风格进行封装
    Args:
        inputs:           上一层的输入
        filter_height:    卷积核的高
        filter_width:     卷积核的宽
        output_channels:  输出通道的个数
        stride:           步长
        padding:          边界格式
        isBias:           是否需要偏置
        name:             这一层的名字 用于区分作用域
        bias_constant     初始化bias的超参数
        stddev_norm       初始化stddev的超参数
    Returns:
        卷积后的多通道图像 [barch,height,width,channel]

    """
    input_channels = int(inputs.get_shape()[-1])  # 通过上一层的输入获取 channelTrue
    fan_in = filter_height * filter_width * input_channels
    stddev = tf.sqrt(stddev_norm * 1.0 / fan_in)
    weights_shape = [filter_height, filter_width, input_channels, output_channels]
    biases_shape = [output_channels]

    with tf.variable_scope(name):
        filters_init = tf.truncated_normal_initializer(stddev=stddev)
        biases_init = tf.constant_initializer(bias_constant * 1.0)

        """
        有的话就话就reuse  没有的话就重新创建
        """
        filters = tf.get_variable(
            'weights' + str(level), shape=weights_shape, initializer=filters_init, collections=['weights', 'variables'])

        """
            add weight decay
        """
        if weight_dacay != 0:
            add_weight_decay(filters, weight_decay=weight_dacay)

        if isBias:
            biases = tf.get_variable(
                'biases' + str(level), shape=biases_shape, initializer=biases_init, collections=['biases', 'variables'])
            return tf.nn.conv2d(inputs, filters, strides=[1, *stride, 1], padding=padding) + biases
        else:
            return tf.nn.conv2d(inputs, filters, strides=[1, *stride, 1], padding=padding)


def deconv2d(inputs, filters_weight, output_factor, level, weight_dacay=0, stride=(2, 2), padding='SAME', isBias=False,
             name='Deconv2D', bias_constant=0):
    """
    将反卷积(上采样)的代码进行包装 成torch格式的
    通道数量不发生改变
    Args:
        inputs:             上一层的输入
        filters_weight:     卷积权重的输入值
        output_factor:      上采样变化方式
        stride:             步长 (1,1)
        padding:            边界
        isBias:             是否需要偏置
        name:               这一层的名字 用于区分作用域
        bias_constant     初始化bias的超参数
    Returns:
            反卷积后的多通道图像 [barch,height,width,channel]
    """
    input_channels = int(inputs.get_shape()[-1])
    # 通道数暂时不发生改变
    output_channels = input_channels
    biases_shape = [output_channels]
    """
        确定输出的output_shape
    """
    batch_size = int(inputs.get_shape()[0])
    rows = int(inputs.get_shape()[1]) * output_factor[0]
    cols = int(inputs.get_shape()[2]) * output_factor[1]
    channels = int(inputs.get_shape()[3])
    output_shape = [batch_size, rows, cols, channels]
    weights_shape = [len(filters_weight), len(filters_weight[0]), output_channels, input_channels]

    with tf.variable_scope(name):
        filters_init = tf.constant_initializer(filters_weight)
        biases_init = tf.constant_initializer(bias_constant * 1.0)

        filters = tf.get_variable(
            'weights' + str(level), shape=weights_shape, initializer=filters_init, collections=['weights', 'variables'])

        """
            add weight decay
        """
        if weight_dacay != 0:
            add_weight_decay(filters,weight_decay=weight_dacay)

        if isBias:
            biases = tf.get_variable(
                'biases' + str(level), shape=biases_shape, initializer=biases_init, collections=['biases', 'variables'])
            return tf.nn.conv2d_transpose(inputs, filters, output_shape, strides=[1, *stride, 1],
                                          padding=padding) + biases
        else:
            return tf.nn.conv2d_transpose(inputs, filters, output_shape, strides=[1, *stride, 1], padding=padding)


def relu(inputs, name='Relu'):
    return tf.nn.relu(inputs, name)


def leaky_relu(inputs, leak=0.1, name='LeakyRelu'):
    """
    Args:
        inputs: 上一层
        leak:    alpha
        name:    激活层的名字

    Returns:
    """
    with tf.name_scope(name):
        return tf.maximum(inputs, leak * inputs)


def batch_norm(inputs, decay, is_training, var_epsilon=1e-3, name='batch_norm'):
    """
    批量的标准化/归一化
    Args:
        inputs:
        decay:
        is_training:
        var_epsilon:
        name:

    Returns:

    """
    with tf.variable_scope(name):
        scale = tf.Variable(tf.ones([int(inputs.get_shape()[-1])]))
        offset = tf.Variable(tf.zeros([int(inputs.get_shape()[-1])]))
        avg_mean = tf.Variable(tf.zeros([int(inputs.get_shape()[-1])]), trainable=False)
        avg_var = tf.Variable(tf.ones([int(inputs.get_shape()[-1])]), trainable=False)

        def get_batch_moments():
            batch_mean, batch_var = tf.nn.moments(inputs, list(range(len(inputs.get_shape()) - 1)))
            assign_mean = tf.assign(avg_mean, decay * avg_mean + (1.0 - decay) * batch_mean)
            assign_var = tf.assign(avg_var, decay * avg_var + (1.0 - decay) * batch_var)
            with tf.control_dependencies([assign_mean, assign_var]):
                return tf.identity(batch_mean), tf.identity(batch_var)

        def get_avg_moments():
            return avg_mean, avg_var

        mean, var = tf.cond(is_training, get_batch_moments, get_avg_moments)
        return tf.nn.batch_normalization(inputs, mean, var, offset, scale, var_epsilon)


def add_weight_decay(var, weight_decay):
    """
    Args:
        var:        原始变量
        weight_decay:   衰减权重 （float）

    Returns:

    """
    wd = tf.Variable(weight_decay,dtype=tf.float32)
    weight_decay = tf.multiply(tf.nn.l2_loss(var), wd, name='weight_loss')
    tf.add_to_collection('weight_losses', weight_decay)
