# This python file need to be run on the zerorpc server. Call the member method through zerorpc
from __future__ import print_function
from calc import calc as real_calc
from inference import predict_SR as real_predict_sr
import sys
import zerorpc
import argument

class PredictApi(object):

    # member method (API to be used by other language)
    def calc(self, text):
        """based on the input text, return the int result"""
        try:
            return real_calc(text)
        except Exception as e:
            return 0.0

    def batch_sr(self, input_file_paths, output_dir_paths, scale_list):
        """ render and store sr images in output_dir_paths """

    def predict_sr(self, input_path, output_dir, out_width, out_height):
        """ render and store temp sr images in output_dir """
        try:
            return real_predict_sr(input_path, output_dir, int(out_width), int(out_height))
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
    path = "./"
    try:
        path = str(sys.argv[2])
    except Exception as e:
        pass
    argument.options.save_path = path

def main():
    addr = 'tcp://127.0.0.1:' + parse_port()
    parse_path()
    s = zerorpc.Server(PredictApi())
    s.bind(addr)
    #print('start running on {}'.format(addr))
    s.run()

if __name__ == '__main__':
    main()
