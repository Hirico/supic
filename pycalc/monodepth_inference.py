# Copyright UCL Business plc 2017. Patent Pending. All rights reserved.
#
# The MonoDepth Software is licensed under the terms of the UCLB ACP-A licence
# which allows for non-commercial use only, the full terms of which are made
# available in the LICENSE file.
#
# For any other use of the software not covered by the UCLB ACP-A Licence,
# please contact info@uclb.com

from __future__ import division

# only keep warnings and errors
import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='0'

import numpy as np
import argparse
import re
import time
import tensorflow as tf
import scipy.misc
import matplotlib.pyplot as plt

from monodepth_model import *
from monodepth_dataloader import *
from average_gradients import *

parser = argparse.ArgumentParser(description='Monodepth TensorFlow implementation.')

parser.add_argument('--encoder',          type=str,   help='type of encoder, vgg or resnet50', default='vgg')
parser.add_argument('--image_path',       type=str,   help='path to the image')
parser.add_argument('--checkpoint_path',  type=str,   help='path to a specific checkpoint to load')
parser.add_argument('--input_height',     type=int,   help='input height', default=256)
parser.add_argument('--input_width',      type=int,   help='input width', default=512)

args = parser.parse_args()

def whether_disp_exists(input_path, out_dir_path):
    output_name = os.path.splitext(os.path.basename(args.image_path))[0]
    disp_path = os.path.join(out_dir_path, "{}_disp.png".format(output_name))
    return os.path.exists(disp_path)

def post_process_disparity(disp):
    _, h, w = disp.shape
    l_disp = disp[0,:,:]
    r_disp = np.fliplr(disp[1,:,:])
    m_disp = 0.5 * (l_disp + r_disp)
    l, _ = np.meshgrid(np.linspace(0, 1, w), np.linspace(0, 1, h))
    l_mask = 1.0 - np.clip(20 * (l - 0.05), 0, 1)
    r_mask = np.fliplr(l_mask)
    return r_mask * l_disp + l_mask * r_disp + (1.0 - l_mask - r_mask) * m_disp

def test_simple(params, image_path, out_dir_path):
    """Test function."""

    input_image = scipy.misc.imread(args.image_path)

    original_height, original_width, num_channels = input_image.shape

    left  = tf.placeholder(tf.float32, [2, args.input_height, args.input_width, 3])
    model = MonodepthModel(params, "test", left, None)

    if num_channels == 4:
        input_image = input_image[:,:,:3]
    elif num_channels == 1:
        input_image = np.tile((input_image, input_image, input_image), 2)
    input_image = scipy.misc.imresize(input_image, [args.input_height, args.input_width], interp='lanczos')
    input_image = input_image.astype(np.float32) / 255
    input_images = np.stack((input_image, np.fliplr(input_image)), 0)

    # SESSION
    config = tf.ConfigProto(allow_soft_placement=True)
    sess = tf.Session(config=config)

    # SAVER
    train_saver = tf.train.Saver()

    # INIT
    sess.run(tf.global_variables_initializer())
    sess.run(tf.local_variables_initializer())
    coordinator = tf.train.Coordinator()
    threads = tf.train.start_queue_runners(sess=sess, coord=coordinator)

    # RESTORE
    restore_path = args.checkpoint_path
    train_saver.restore(sess, restore_path)

    disp = sess.run(model.disp_left_est[0], feed_dict={left: input_images})
    disp_pp = post_process_disparity(disp.squeeze()).astype(np.float32)

    depth = params.focal_length * params.baseline / disp_pp
    depth = depth / np.amax(depth)

    output_name = os.path.splitext(os.path.basename(args.image_path))[0]

    depth_to_img = scipy.misc.imresize(depth, [original_height, original_width])
    output_path = os.path.join(out_dir_path, "{}_depth.png".format(output_name))
    plt.imsave(output_path, depth_to_img, cmap='gray')

    return output_path

def predict_depth(input_path, out_dir_path):

    params = monodepth_parameters(
        encoder=args.encoder,
        height=args.input_height,
        width=args.input_width,
        batch_size=2,
        num_threads=1,
        num_epochs=1,
        do_stereo=False,
        wrap_mode="border",
        use_deconv=False,
        alpha_image_loss=0,
        disp_gradient_loss_weight=0,
        lr_loss_weight=0,
        full_summary=False,
        focal_length=30,
        baseline=22
        )

    args.image_path = input_path
    return test_simple(params, input_path, out_dir_path)

if __name__ == '__main__':
    args.checkpoint_path = './depth/monodepth'
    predict_depth('./test512.jpg', './')
