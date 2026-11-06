import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('ues_su.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

idx = html.find('cat2List')
if idx != -1:
    print(html[idx:idx+4000])
