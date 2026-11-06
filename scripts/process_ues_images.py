from PIL import Image, ImageFilter
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Source directory
SRC_DIR = 'ues_highres'
OUT_DIR = 'public/images/products'
os.makedirs(OUT_DIR, exist_ok=True)

CANVAS_WIDTH = 1000
CANVAS_HEIGHT = 750
BG_COLOR = (255, 255, 255, 255) # Pure white
GROUND_Y = 650
TARGET_HEIGHT = 560

items = [
    {
        'src': 'tmg_1000-2500.png',
        'out_name': 'tmg-series',
        'title': 'Трансформатор ТМГ 1000-2500/10'
    },
    {
        'src': 'tmg_160-630.png',
        'out_name': 'tmg-medium',
        'title': 'Трансформатор ТМГ 630/10'
    },
    {
        'src': 'tslz_250-2500.png',
        'out_name': 'tszl-series',
        'title': 'Трансформатор ТСЗЛ 630-2500/10 в кожухе IP31'
    },
    {
        'src': 'tsl_250-2500.png',
        'out_name': 'tsl-series',
        'title': 'Трансформатор ТСЛ 630-2500/10 с литой изоляцией IP00'
    },
    {
        'src': 'tmn_2500-6300.png',
        'out_name': 'tmn-series',
        'title': 'Трансформатор ТМН 4000-6300/35 с РПН'
    },
    {
        'src': 'tdns-35_10000-16000_01.png',
        'out_name': 'tdns-series',
        'title': 'Трансформатор ТДНС 10000-16000/35'
    },
    {
        'src': '110_208x5_300_260.jpg',
        'out_name': 'tdtn-110-series',
        'title': 'Трансформатор ТДТН 110 кВ'
    }
]

def make_studio_image(src_path, out_base):
    img = Image.open(src_path)
    
    # If image is RGB (like 110 kV), make white background transparent
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
        datas = img.getdata()
        new_data = []
        for item in datas:
            # If close to white
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)
        
    # Crop bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    # Scale image to TARGET_HEIGHT while maintaining aspect ratio
    w, h = img.size
    scale = TARGET_HEIGHT / float(h)
    new_w = int(w * scale)
    new_h = TARGET_HEIGHT
    
    # If width exceeds max width (880), scale by width instead
    if new_w > 860:
        scale = 860.0 / float(w)
        new_w = 860
        new_h = int(h * scale)
        
    resized_img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Create pure white canvas
    canvas = Image.new('RGBA', (CANVAS_WIDTH, CANVAS_HEIGHT), BG_COLOR)
    
    # Calculate position
    pos_x = (CANVAS_WIDTH - new_w) // 2
    # Align bottom of transformer to GROUND_Y
    pos_y = GROUND_Y - new_h
    
    # Create soft contact shadow
    shadow_w = int(new_w * 0.9)
    shadow_h = 36
    shadow = Image.new('RGBA', (CANVAS_WIDTH, CANVAS_HEIGHT), (0, 0, 0, 0))
    from PIL import ImageDraw
    draw = ImageDraw.Draw(shadow)
    
    shadow_x0 = (CANVAS_WIDTH - shadow_w) // 2
    shadow_x1 = shadow_x0 + shadow_w
    shadow_y0 = GROUND_Y - 14
    shadow_y1 = GROUND_Y + 18
    
    # Multi-layered soft ambient shadow
    draw.ellipse([shadow_x0, shadow_y0, shadow_x1, shadow_y1], fill=(40, 50, 60, 90))
    # Core contact shadow
    core_w = int(shadow_w * 0.7)
    core_x0 = (CANVAS_WIDTH - core_w) // 2
    draw.ellipse([core_x0, GROUND_Y - 8, core_x0 + core_w, GROUND_Y + 8], fill=(30, 40, 50, 140))
    
    # Blur shadow
    shadow = shadow.filter(ImageFilter.GaussianBlur(radius=8))
    
    # Composite shadow onto canvas
    canvas.alpha_composite(shadow)
    
    # Composite transformer onto canvas
    canvas.alpha_composite(resized_img, (pos_x, pos_y))
    
    # Convert to RGB for saving
    rgb_canvas = canvas.convert('RGB')
    
    # Save as WebP and PNG
    webp_path = os.path.join(OUT_DIR, f"{out_base}.webp")
    png_path = os.path.join(OUT_DIR, f"{out_base}.png")
    
    rgb_canvas.save(webp_path, 'WEBP', quality=95)
    rgb_canvas.save(png_path, 'PNG', optimize=True)
    print(f"✅ Generated {webp_path} ({os.path.getsize(webp_path)} bytes) & {png_path}")

for it in items:
    src_p = os.path.join(SRC_DIR, it['src'])
    if os.path.exists(src_p):
        make_studio_image(src_p, it['out_name'])
    else:
        print(f"Missing {src_p}")
