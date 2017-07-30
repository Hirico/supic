from PIL import Image
from PIL import ImageFilter
from PIL import ImageEnhance
import time

def lens_blur(input_path, depthmap_path, min_focal, max_focal, transition, radius, brightness, angle, output_dir, speed=1):
    """ lens blur """
    im = Image.open(input_path)
    im.load()
    format = im.format
    depthmap = Image.open(depthmap_path)
    depth_px = depthmap.load()

    power = 10 ** brightness
    speed = int(min(speed, im.width, im.height))

    # prepare gradient filters and filtered images
    out_of_focus_filter = ImageFilter.GaussianBlur(radius)
    gradient_filters = []
    filtered_images = []
    copy_box = (0, 0, im.width, im.height)

    for i in range(radius):
        gradient_filters.append(ImageFilter.GaussianBlur(i + 1))
        image_i = im.crop(copy_box)
        enhancer = ImageEnhance.Brightness(image_i)
        image_i = enhancer.enhance(power)

        filtered_images.append(image_i.filter(gradient_filters[i]))

    # manipulate pixel
    for i in range(0, im.width, speed):
        for j in range(0, im.height, speed):
            depth = depth_px[i,j][0]
            box = (i, j, i + speed, j + speed)
            pixel = im.crop(box)
            if depth - max_focal >= transition or min_focal - depth >= transition:
                pixel = filtered_images[radius - 1].crop(box)
            elif depth - max_focal > 0:
                pixel = filtered_images[int((depth - max_focal)/transition*radius) - 1].crop(box)
            elif min_focal - depth > 0:
                pixel = filtered_images[int((min_focal - depth)/transition*radius) - 1].crop(box)
            im.paste(pixel, box)

    # output image
    name = hex(int(time.time() * 100000))[2:]
    path = output_dir + '/' + str(name) + '.' + format
    im.save(path)
    return path

if __name__ == '__main__':
    lens_blur('./test.jpg', './Flowers-depthmap.jpg', 10, 150, 20, 2, -1, 0, '.', 4)
