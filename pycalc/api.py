# This python file need to be run on the zerorpc server. Call the member method through zerorpc
from __future__ import print_function
from inference_sr import predict_SR as real_predict_sr
import sys
import zerorpc
import argument_sr
from monodepth_inference import args as args_monodepth
from monodepth_inference import predict_depth as real_predict_depth
from tensorflow import reset_default_graph

class PredictApi(object):

    # member method (API to be used by other language)
    def batch_sr(self, input_file_paths, output_dir_paths, scale_list):
        """ render and store sr images in output_dir_paths """

    def predict_sr(self, input_path, output_dir, out_width, out_height):
        """ render and store temp sr images in output_dir """
        try:
            result = real_predict_sr(input_path, output_dir, int(out_width), int(out_height))
            reset_default_graph()
            return result
        except Exception as e:
            return '!ERROR' + str(e)

    def predict_depth(self, input_path, output_dir):
        """ render and store temp depth image in output_dir """
        try:
            result = real_predict_depth(input_path, output_dir)
            reset_default_graph()
            return result
        except Exception as e:
            return '!ERROR' + str(e)

def parse_port():
    port = 4242
    try:
        port = int(sys.argv[1])
    except Exception as e:
        pass
    return '{}'.format(port)

def parse_path():
    path = './'
    try:
        path = str(sys.argv[2])
    except Exception as e:
        pass
    argument_sr.options.save_path = path + 'sr/'
    args_monodepth.checkpoint_path = path + 'depth/monodepth'

def main():
    addr = 'tcp://127.0.0.1:' + parse_port()
    parse_path()
    s = zerorpc.Server(PredictApi())
    s.bind(addr)
    #print('start running on {}'.format(addr))
    s.run()

if __name__ == '__main__':
    main()
