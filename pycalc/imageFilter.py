from PIL import Image
from PIL import ImageFilter
import time

def lens_blur(input_path, depthmap_path, min_focal, max_focal, transition, radius, brightness, angle, output_dir):
    """ lens blur """
    im = Image.open(input_path)
    im.load()
    format = im.format
    depthmap = Image.open(depthmap_path)
    depth_px = depthmap.load()

    # prepare gradient filters
    out_of_focus_filter = ImageFilter.GaussianBlur(radius)
    gradient_filters = []
    for i in range(transition):
        gradient_filters.append(ImageFilter.GaussianBlur(radius*(float(i + 1)/transition)))

    # manipulate pixel
    for i in range(im.width):
        for j in range(im.height):
            depth = depth_px[i,j][0]
            box = (i, j, i+4, j+4)
            pixel = im.crop(box)
            if depth - max_focal >= transition or min_focal - depth >= transition:
                pixel = pixel.filter(out_of_focus_filter)
            elif depth - max_focal > 0:
                pixel = pixel.filter(gradient_filters[int(depth - max_focal)])
            elif min_focal - depth > 0:
                pixel = pixel.filter(gradient_filters[int(min_focal - depth)])
            im.paste(pixel, box)

    # output image
    name = hex(int(time.time() * 100000))[2:]
    im.save(output_dir + str(name) + '.' + format)


if __name__ == '__main__':
    lens_blur('./test.jpg', './test_depth.jpg', 0, 200, 10, 30, 0, 0, './')
