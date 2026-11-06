from PIL import Image
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

for f in os.listdir('ues_highres'):
    p = os.path.join('ues_highres', f)
    im = Image.open(p)
    print(f"File: {f:25} | Size: {im.size} | Mode: {im.mode}")
