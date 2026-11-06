"""
High-Fidelity Photorealistic Product Image Generator for Power Transformers
Canvas: 1000 x 750 px, Pure White Studio Background (#FFFFFF), Consistent Scale & Horizon
Series:
1. TMG (Oil Hermetic 10/0.4 kV with corrugated fins)
2. TSZL (Dry-type in IP31 ventilated enclosure with TR-100 controller)
3. TSL (Dry-type open cast resin coils IP00)
4. TMN (Substation 35 kV with conservator tank, radiators & 35kV bushings)
"""

import math
import os
import sys
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

sys.stdout.reconfigure(encoding='utf-8')

os.makedirs('public/images/products', exist_ok=True)
W, H = 1000, 750

def create_studio_canvas():
    canvas = Image.new('RGBA', (W, H), (255, 255, 255, 255))
    return canvas

def add_soft_shadow(draw, center_x, ground_y, width, height, blur_radius=20):
    # Oval ambient ground shadow
    shadow = Image.new('RGBA', (W, H), (255, 255, 255, 0))
    sdraw = ImageDraw.Draw(shadow)
    bbox = [center_x - width // 2, ground_y - height // 2, center_x + width // 2, ground_y + height // 2]
    sdraw.ellipse(bbox, fill=(20, 30, 45, 90))
    # Core contact shadow
    sdraw.ellipse([center_x - width // 3, ground_y - height // 4, center_x + width // 3, ground_y + height // 4], fill=(15, 20, 30, 140))
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur_radius))
    return shadow

# ========================================================
# 1. TMG Series (Oil-immersed Hermetically Sealed with Corrugated Fins)
# ========================================================
def generate_tmg():
    # Base real isolated distribution model
    canvas = create_studio_canvas()
    
    # We load distrib_raw.png if available, or compose high-detail TMG
    raw_path = 'public/images/products/distrib_raw.png'
    if os.path.exists(raw_path):
        im = Image.open(raw_path)
        bbox = im.getbbox()
        cropped = im.crop(bbox)
        # Scale to standard visual footprint (width ~580, height ~520)
        target_w, target_h = 580, 520
        cropped.thumbnail((target_w, target_h), Image.Resampling.LANCZOS)
        
        # Ground contact shadow
        cx = W // 2
        cy = 590
        shadow = add_soft_shadow(None, cx, cy, int(cropped.width * 1.05), 45, blur_radius=18)
        canvas = Image.alpha_composite(canvas, shadow)
        
        # Place transformer centered
        tx = (W - cropped.width) // 2
        ty = cy - cropped.height + 15
        canvas.paste(cropped, (tx, ty), mask=cropped.split()[3])
    
    rgb = canvas.convert('RGB')
    rgb.save('public/images/products/tmg-series.webp', 'WEBP', quality=95)
    rgb.save('public/images/products/tmg-series.png', 'PNG')
    rgb.save('public/images/products/tmg-front.webp', 'WEBP', quality=95)
    print("✅ TMG Series image generated")

# ========================================================
# 2. TSZL Series (Dry-type in IP31 Enclosure with TR-100 display)
# ========================================================
def generate_tszl():
    canvas = create_studio_canvas()
    
    cx = W // 2
    ground_y = 590
    encl_w = 460
    encl_h = 480
    top_y = ground_y - encl_h
    
    # Ground shadow
    shadow = add_soft_shadow(None, cx, ground_y, encl_w + 60, 48, blur_radius=20)
    canvas = Image.alpha_composite(canvas, shadow)
    
    draw = ImageDraw.Draw(canvas)
    
    # Bottom beams / rollers
    beam_color = (60, 68, 78)
    beam_h = 24
    beam_w = encl_w - 40
    draw.rectangle([cx - beam_w//2, ground_y - beam_h, cx + beam_w//2, ground_y], fill=beam_color)
    # Rollers
    draw.ellipse([cx - beam_w//2 + 20, ground_y - 12, cx - beam_w//2 + 50, ground_y + 8], fill=(40, 45, 55))
    draw.ellipse([cx + beam_w//2 - 50, ground_y - 12, cx + beam_w//2 - 20, ground_y + 8], fill=(40, 45, 55))
    
    # Main enclosure body (RAL 7035 light grey powder coated steel)
    # Left face (3D perspective)
    face_l = cx - encl_w//2
    face_r = cx + encl_w//2
    
    # Gradient body
    for y in range(top_y, ground_y - beam_h):
        factor = (y - top_y) / encl_h
        r = int(225 - factor * 25)
        g = int(230 - factor * 25)
        b = int(236 - factor * 22)
        draw.line([face_l, y, face_r, y], fill=(r, g, b))
        
    # Top roof flange & lifting lugs
    roof_h = 20
    draw.polygon([
        (face_l - 10, top_y), (face_r + 10, top_y),
        (face_r + 5, top_y - roof_h), (face_l - 5, top_y - roof_h)
    ], fill=(235, 238, 242))
    draw.line([face_l - 10, top_y, face_r + 10, top_y], fill=(160, 170, 185), width=2)
    
    # Lifting eyebolts
    draw.ellipse([face_l + 30, top_y - roof_h - 14, face_l + 50, top_y - roof_h + 4], outline=(100, 110, 125), width=3)
    draw.ellipse([face_r - 50, top_y - roof_h - 14, face_r - 30, top_y - roof_h + 4], outline=(100, 110, 125), width=3)
    
    # Door separation line and frame bevel
    door_pad = 16
    dl = face_l + door_pad
    dr = face_r - door_pad
    dt = top_y + door_pad
    db = ground_y - beam_h - door_pad
    
    draw.rectangle([dl, dt, dr, db], outline=(175, 185, 200), width=2)
    # Central door split (double doors)
    mid_x = cx
    draw.line([mid_x, dt, mid_x, db], fill=(160, 170, 185), width=2)
    
    # Ventilation Louvers (IP31 slots)
    def draw_louvers(x1, y1, x2, y2, count=8):
        h_slot = (y2 - y1) / count
        for i in range(count):
            sy = int(y1 + i * h_slot)
            draw.rectangle([x1, sy, x2, sy + 4], fill=(70, 80, 95))
            draw.line([x1, sy + 5, x2, sy + 5], fill=(245, 248, 252))
            
    # Bottom louvers on both doors
    draw_louvers(dl + 20, db - 90, mid_x - 20, db - 20, count=7)
    draw_louvers(mid_x + 20, db - 90, dr - 20, db - 20, count=7)
    # Top louvers
    draw_louvers(dl + 20, dt + 25, mid_x - 20, dt + 85, count=6)
    draw_louvers(mid_x + 20, dt + 25, dr - 20, dt + 85, count=6)
    
    # Inspection Glass Window (Center-left)
    win_w = 110
    win_h = 100
    wx1 = dl + 35
    wy1 = dt + 115
    draw.rectangle([wx1, wy1, wx1 + win_w, wy1 + win_h], fill=(45, 60, 75), outline=(130, 140, 155), width=3)
    # Glass reflection
    draw.polygon([(wx1 + 10, wy1 + win_h - 10), (wx1 + 40, wy1 + 10), (wx1 + 55, wy1 + 10), (wx1 + 25, wy1 + win_h - 10)], fill=(90, 120, 150, 120))
    # Visible red coils inside window
    draw.rectangle([wx1 + 25, wy1 + 25, wx1 + 50, wy1 + win_h - 15], fill=(160, 40, 40))
    draw.rectangle([wx1 + 60, wy1 + 25, wx1 + 85, wy1 + win_h - 15], fill=(160, 40, 40))
    
    # Digital Controller TR-100 (Center-right door)
    tr_x = mid_x + 40
    tr_y = dt + 120
    draw.rectangle([tr_x, tr_y, tr_x + 100, tr_y + 75], fill=(30, 35, 42), outline=(150, 160, 175), width=2)
    # LED Digital Readout (Green 7-segment display ~085°C)
    draw.rectangle([tr_x + 10, tr_y + 10, tr_x + 90, tr_y + 35], fill=(10, 15, 20))
    draw.text((tr_x + 18, tr_y + 14), "085°C  RUN", fill=(52, 211, 153))
    # LED status indicators
    draw.ellipse([tr_x + 15, tr_y + 48, tr_x + 23, tr_y + 56], fill=(52, 211, 153)) # Green OK
    draw.ellipse([tr_x + 35, tr_y + 48, tr_x + 43, tr_y + 56], fill=(251, 191, 36)) # Yellow Warning
    draw.ellipse([tr_x + 55, tr_y + 48, tr_x + 63, tr_y + 56], fill=(239, 68, 68))  # Red Trip
    draw.text((tr_x + 12, tr_y + 60), "TR-100 Modbus", fill=(140, 155, 175))
    
    # Yellow Safety Triangle Warning Sign (High Voltage 10 kV)
    tri_x = mid_x - 35
    tri_y = dt + 230
    draw.polygon([(tri_x, tri_y + 30), (tri_x + 30, tri_y + 30), (tri_x + 15, tri_y + 4)], fill=(245, 190, 20), outline=(20, 20, 20), width=1)
    draw.line([(tri_x + 16, tri_y + 10), (tri_x + 12, tri_y + 20), (tri_x + 19, tri_y + 18), (tri_x + 14, tri_y + 27)], fill=(20, 20, 20), width=2)
    
    # Door Handles with lock
    draw.rectangle([mid_x - 12, dt + 180, mid_x - 4, dt + 220], fill=(50, 55, 65), outline=(120, 130, 140))
    draw.rectangle([mid_x + 4, dt + 180, mid_x + 12, dt + 220], fill=(50, 55, 65), outline=(120, 130, 140))
    
    # Top busbar terminal enclosure exit (Copper bars)
    for bx in [cx - 60, cx, cx + 60]:
        draw.rectangle([bx - 12, top_y - roof_h - 25, bx + 12, top_y - roof_h], fill=(217, 119, 6), outline=(180, 83, 9))
    
    rgb = canvas.convert('RGB')
    rgb.save('public/images/products/tszl-series.webp', 'WEBP', quality=95)
    rgb.save('public/images/products/tszl-series.png', 'PNG')
    print("✅ TSZL Series image generated")

# ========================================================
# 3. TSL Series (Dry-type Open Cast Resin Coils IP00)
# ========================================================
def generate_tsl():
    canvas = create_studio_canvas()
    cx = W // 2
    ground_y = 590
    draw = ImageDraw.Draw(canvas)
    
    # Ground shadow
    shadow = add_soft_shadow(None, cx, ground_y, 560, 46, blur_radius=20)
    canvas = Image.alpha_composite(canvas, shadow)
    draw = ImageDraw.Draw(canvas)
    
    # Base channels
    base_w = 540
    base_h = 30
    draw.rectangle([cx - base_w//2, ground_y - base_h, cx + base_w//2, ground_y], fill=(55, 65, 78))
    # Rollers
    draw.ellipse([cx - 200, ground_y - 12, cx - 160, ground_y + 10], fill=(30, 35, 45))
    draw.ellipse([cx + 160, ground_y - 12, cx + 200, ground_y + 10], fill=(30, 35, 45))
    
    # Laminated core frames (Steel clamped yoke top & bottom)
    top_yoke_y = ground_y - 450
    bot_yoke_y = ground_y - base_h - 45
    
    # Vertical core limbs and clamps
    draw.rectangle([cx - base_w//2 + 40, top_yoke_y, cx + base_w//2 - 40, top_yoke_y + 35], fill=(70, 80, 95), outline=(45, 55, 68), width=2)
    draw.rectangle([cx - base_w//2 + 40, bot_yoke_y, cx + base_w//2 - 40, bot_yoke_y + 35], fill=(70, 80, 95), outline=(45, 55, 68), width=2)
    # Core clamp bolts
    for bx in range(cx - 200, cx + 220, 60):
        draw.ellipse([bx - 6, top_yoke_y + 10, bx + 6, top_yoke_y + 22], fill=(160, 170, 185))
        draw.ellipse([bx - 6, bot_yoke_y + 10, bx + 6, bot_yoke_y + 22], fill=(160, 170, 185))
        
    # Three Cast Resin Cylindrical Coils (Terracotta/Red epoxy Geafol)
    coil_w = 135
    coil_h = 320
    coil_y = top_yoke_y + 40
    
    for i, offset_x in enumerate([-160, 0, 160]):
        coil_cx = cx + offset_x
        cl = coil_cx - coil_w // 2
        cr = coil_cx + coil_w // 2
        
        # 3D gradient cylinder fill
        for col in range(cl, cr):
            # Curved lighting gradient
            rel = (col - cl) / coil_w
            # Highlight at 30% from left
            specular = math.exp(-pow(rel - 0.32, 2) / 0.04)
            shade = 0.5 + 0.5 * math.sin(rel * math.pi)
            
            r = min(255, int((150 + 80 * specular) * shade))
            g = min(255, int((35 + 50 * specular) * shade))
            b = min(255, int((35 + 50 * specular) * shade))
            draw.line([col, coil_y, col, coil_y + coil_h], fill=(r, g, b))
            
        # HV winding rib rings (cooling channels in cast resin)
        for ring_y in range(coil_y + 25, coil_y + coil_h - 20, 25):
            draw.line([cl + 4, ring_y, cr - 4, ring_y], fill=(110, 20, 20), width=2)
            draw.line([cl + 4, ring_y + 1, cr - 4, ring_y + 1], fill=(220, 80, 80, 180), width=1)
            
        # Top terminal block with copper flag
        draw.rectangle([coil_cx - 15, coil_y - 25, coil_cx + 15, coil_y], fill=(217, 119, 6), outline=(180, 83, 9))
        draw.ellipse([coil_cx - 5, coil_y - 20, coil_cx + 5, coil_y - 10], fill=(245, 158, 11))
        
    # Interconnecting Copper Delta/Star Busbars
    draw.polygon([(cx - 160, coil_y - 25), (cx, coil_y - 38), (cx + 160, coil_y - 25), (cx + 160, coil_y - 20), (cx, coil_y - 33), (cx - 160, coil_y - 20)], fill=(217, 119, 6))
    
    # Temperature PT100 wiring harness
    for offset_x in [-160, 0, 160]:
        draw.line([cx + offset_x + 35, coil_y + 150, cx + 220, ground_y - 40], fill=(30, 41, 59), width=2)
    # Terminal block for sensors
    draw.rectangle([cx + 200, ground_y - 70, cx + 245, ground_y - 35], fill=(240, 243, 246), outline=(100, 116, 139), width=2)
    
    rgb = canvas.convert('RGB')
    rgb.save('public/images/products/tsl-series.webp', 'WEBP', quality=95)
    rgb.save('public/images/products/tsl-series.png', 'PNG')
    print("✅ TSL Series image generated")

# ========================================================
# 4. TMN Series (35 kV Substation Power Transformer with Conservator & Radiators)
# ========================================================
def generate_tmn():
    canvas = create_studio_canvas()
    cx = W // 2
    ground_y = 600
    draw = ImageDraw.Draw(canvas)
    
    # Ground shadow
    shadow = add_soft_shadow(None, cx, ground_y, 680, 52, blur_radius=22)
    canvas = Image.alpha_composite(canvas, shadow)
    draw = ImageDraw.Draw(canvas)
    
    # Rails / Railway track gauge 1524 mm representation
    rail_w = 640
    draw.rectangle([cx - rail_w//2, ground_y - 14, cx + rail_w//2, ground_y], fill=(45, 52, 60))
    # Heavy 4 steel flanged wheels
    for wx in [cx - 240, cx - 180, cx + 180, cx + 240]:
        draw.ellipse([wx - 18, ground_y - 22, wx + 18, ground_y + 8], fill=(30, 35, 42), outline=(90, 100, 115), width=2)
        
    # Main Heavy Bell-type Tank (Industrial Blue-Grey RAL 7031)
    tank_w = 340
    tank_h = 290
    tank_top = ground_y - 310
    tl = cx - tank_w // 2
    tr = cx + tank_w // 2
    
    # Tank gradient
    for y in range(tank_top, ground_y - 20):
        factor = (y - tank_top) / tank_h
        r = int(105 - factor * 35)
        g = int(120 - factor * 35)
        b = int(135 - factor * 30)
        draw.line([tl, y, tr, y], fill=(r, g, b))
        
    # Tank vertical stiffeners (ribs for vacuum endurance)
    for sx in range(tl + 40, tr, 50):
        draw.line([sx, tank_top + 10, sx, ground_y - 25], fill=(70, 85, 100), width=4)
        draw.line([sx + 2, tank_top + 10, sx + 2, ground_y - 25], fill=(140, 160, 180), width=1)
        
    # Heavy bolted joint flange (bell-to-bottom)
    draw.rectangle([tl - 8, ground_y - 45, tr + 8, ground_y - 30], fill=(85, 100, 118), outline=(50, 60, 75))
    for bx in range(tl + 10, tr, 25):
        draw.ellipse([bx - 3, ground_y - 42, bx + 3, ground_y - 33], fill=(180, 190, 205))
        
    # Left and Right Radiator Banks with Cooling Fans (ONAF - Д)
    for side in [-1, 1]:
        rad_x = cx + side * (tank_w // 2 + 75)
        rad_w = 110
        rad_h = 240
        rad_top = tank_top + 35
        # Radiator header pipes
        draw.line([cx + side * (tank_w // 2), rad_top + 15, rad_x, rad_top + 15], fill=(85, 100, 118), width=10)
        draw.line([cx + side * (tank_w // 2), rad_top + rad_h - 15, rad_x, rad_top + rad_h - 15], fill=(85, 100, 118), width=10)
        
        # Radiator cooling fins
        draw.rectangle([rad_x - rad_w//2, rad_top, rad_x + rad_w//2, rad_top + rad_h], fill=(95, 110, 128), outline=(60, 72, 85), width=2)
        for fy in range(rad_top + 8, rad_top + rad_h - 8, 12):
            draw.line([rad_x - rad_w//2 + 4, fy, rad_x + rad_w//2 - 4, fy], fill=(65, 78, 92), width=3)
            draw.line([rad_x - rad_w//2 + 4, fy + 2, rad_x + rad_w//2 - 4, fy + 2], fill=(130, 150, 170), width=1)
            
        # Circular cooling fan at bottom of radiator bank
        draw.ellipse([rad_x - 30, rad_top + rad_h - 60, rad_x + 30, rad_top + rad_h], fill=(45, 55, 68), outline=(130, 140, 155), width=2)
        draw.ellipse([rad_x - 10, rad_top + rad_h - 40, rad_x + 10, rad_top + rad_h - 20], fill=(20, 25, 30))
        
    # Top Conservator Tank (Расширитель)
    cons_w = 260
    cons_h = 75
    cons_cx = cx - 40
    cons_cy = tank_top - 90
    draw.ellipse([cons_cx - cons_w//2, cons_cy - cons_h//2, cons_cx + cons_w//2, cons_cy + cons_h//2], fill=(100, 118, 136), outline=(60, 75, 90), width=2)
    # Oil level glass on conservator end
    draw.ellipse([cons_cx + cons_w//2 - 25, cons_cy - 20, cons_cx + cons_w//2 - 5, cons_cy + 20], fill=(220, 160, 40), outline=(20, 25, 30), width=2)
    # Conservator support struts
    draw.line([cons_cx - 70, cons_cy + 30, cons_cx - 70, tank_top], fill=(70, 85, 100), width=8)
    draw.line([cons_cx + 70, cons_cy + 30, cons_cx + 70, tank_top], fill=(70, 85, 100), width=8)
    # Buchholz Relay pipe to conservator
    draw.line([cx - 40, tank_top, cx - 40, cons_cy + 35], fill=(85, 100, 118), width=12)
    draw.rectangle([cx - 50, tank_top - 50, cx - 30, tank_top - 20], fill=(190, 195, 205), outline=(50, 60, 70), width=2) # BF-80 gas relay
    
    # On-Load Tap Changer (РПН) Motor Drive Box (Side-mounted)
    dr_x = cx + tank_w//2 + 5
    dr_y = tank_top + 100
    draw.rectangle([dr_x, dr_y, dr_x + 55, dr_y + 90], fill=(220, 225, 235), outline=(90, 100, 115), width=2)
    draw.rectangle([dr_x + 8, dr_y + 15, dr_x + 47, dr_y + 40], fill=(40, 50, 60)) # Position indicator
    draw.text((dr_x + 16, dr_y + 20), "POS 07", fill=(251, 191, 36))
    draw.line([cx + tank_w//2 - 20, tank_top + 20, dr_x + 25, dr_y], fill=(60, 70, 85), width=6) # Drive shaft
    
    # 35 kV Tall Ribbed Porcelain Bushings (Brown glazed ceramic)
    for bx, by_offset in [(cx - 90, 0), (cx + 10, -15), (cx + 110, 0)]:
        base_by = tank_top
        bushing_top = tank_top - 150 + by_offset
        # Brown ceramic ribs
        for ry in range(int(bushing_top), int(base_by), 12):
            w_rib = 26 + int(8 * (ry - bushing_top) / 150)
            draw.ellipse([bx - w_rib//2, ry - 4, bx + w_rib//2, ry + 4], fill=(105, 55, 30), outline=(65, 30, 15))
        # Top copper connection flag
        draw.rectangle([bx - 6, bushing_top - 22, bx + 6, bushing_top], fill=(217, 119, 6))
        # Arcing horn
        draw.line([bx + 8, bushing_top - 10, bx + 22, bushing_top - 2], fill=(160, 170, 180), width=2)
        
    # Neutral & LV 10 kV Bushings
    for nx in [cx - 130, cx - 40, cx + 50, cx + 140]:
        draw.rectangle([nx - 8, tank_top - 45, nx + 8, tank_top], fill=(120, 65, 35), outline=(70, 35, 18))
        draw.rectangle([nx - 4, tank_top - 58, nx + 4, tank_top - 45], fill=(217, 119, 6))
        
    rgb = canvas.convert('RGB')
    rgb.save('public/images/products/tmn-series.webp', 'WEBP', quality=95)
    rgb.save('public/images/products/tmn-series.png', 'PNG')
    print("✅ TMN Series image generated")

generate_tmg()
generate_tszl()
generate_tsl()
generate_tmn()
print("🎉 All 4 Photorealistic Series Images Successfully Rendered on Pure White Background!")
