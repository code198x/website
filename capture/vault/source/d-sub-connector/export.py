"""Publish small SVG views and the full plate from technical-plate.svg.
Run Blender with technical_plate.py first; then python3 export.py.
"""
from pathlib import Path
import copy
import xml.etree.ElementTree as ET
S=Path(__file__).resolve().parent
DEST=S.parents[3]/'public/images/vault/hardware/d-sub-connector'
DEST.mkdir(parents=True,exist_ok=True)
NS='http://www.w3.org/2000/svg'
ET.register_namespace('',NS)
ET.register_namespace('inkscape','http://www.inkscape.org/namespaces/inkscape')
plate=ET.parse(S/'technical-plate.svg').getroot()
for filename,group,box,width,height,title in [
    ('assembled.svg','Assembled inset','1140 910 380 245',480,310,'Nine-pin male D-sub connector, assembled'),
    ('exploded.svg','Exploded model','150 220 810 800',520,514,'Exploded view of a nine-pin male D-sub connector')]:
    root=ET.Element(f'{{{NS}}}svg',{'viewBox':box,'width':str(width),'height':str(height)})
    ET.SubElement(root,f'{{{NS}}}title').text=title
    x,y,w,h=box.split()
    ET.SubElement(root,f'{{{NS}}}rect',{'x':x,'y':y,'width':w,'height':h,'fill':'#f4f1e8'})
    root.append(copy.deepcopy(next(g for g in plate if g.get('id')==group)))
    ET.ElementTree(root).write(DEST/filename,encoding='utf-8',xml_declaration=True)
(DEST/'technical-plate.svg').write_bytes((S/'technical-plate.svg').read_bytes())
print(DEST)

# C64-specific pin numbering; this drawing is not a universal D-sub pinout.
# Source: Commodore 64 Programmer's Reference Guide, appendix I, p. 395.
from html import escape
pin_svg=['<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">',
'<title>C64 control port, looking into the computer</title>',
'<desc>Male port, wide row at top. Top row: pins 1 to 5 left to right. Bottom row: pins 6 to 9 left to right. Pin 7 is plus five volts; pin 8 is ground.</desc>',
'<rect width="600" height="300" fill="#f4f1e8"/>',
'<text x="300" y="36" text-anchor="middle" font-family="sans-serif" font-size="18" fill="#3a2c1f">C64 · looking into the computer’s port</text>',
'<path d="M102 75 H498 Q520 75 514 97 L489 217 Q486 229 470 229 H130 Q114 229 111 217 L86 97 Q80 75 102 75 Z" fill="#e5e2d9" stroke="#3a2c1f" stroke-width="2"/>',
'<path d="M105 84 H495 Q510 84 505 99 L481 214 Q479 221 468 221 H132 Q121 221 119 214 L95 99 Q90 84 105 84 Z" fill="#faf8f2" stroke="#3a2c1f" stroke-width="1"/>']
for number in range(1,10):
    x=156+(number-1)*72 if number<=5 else 192+(number-6)*72
    y=127 if number<=5 else 187
    pin_svg.append(f'<circle cx="{x}" cy="{y}" r="11" fill="#d9c49c" stroke="#3a2c1f" stroke-width="1.5"/><text x="{x}" y="{y-18}" text-anchor="middle" font-family="monospace" font-size="30" fill="#3a2c1f">{number}</text>')
pin_svg.append('<text x="300" y="268" text-anchor="middle" font-family="sans-serif" font-size="16" fill="#3a2c1f">Male mating face · not the cable socket or wiring side</text></svg>')
(DEST/'c64-control-port.svg').write_text('\n'.join(pin_svg))
