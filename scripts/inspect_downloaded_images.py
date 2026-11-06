from PIL import Image
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

for f in os.listdir('ues_images'):
    p = os.path.join('ues_images', f)
    im = Image.open(p)
    print(f"File: {f} | Size: {im.size} | Mode: {im.mode}")
    # Check corner pixels
    corners = [
        im.getpixel((0, 0)),
        im.getpixel((im.width-1, 0)),
        im.getpixel((0, im.height-1)),
        im.getpixel((im.width-1, im.height-1))
    ]
    print(f"  Corners: {corners}")
