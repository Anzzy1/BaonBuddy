# Combines review stills into a labeled contact sheet: python scripts/sheet.py out.jpg f0060 f0130 ...
import sys
from PIL import Image, ImageDraw
out, names = sys.argv[1], sys.argv[2:]
ims = [Image.open(f'.work/stills/{n}.jpg') for n in names]
w, h = 800, 450
cols = 2
rows = (len(ims) + 1) // cols
sheet = Image.new('RGB', (cols * w + 10, rows * (h + 10)), 'gray')
for i, (n, im) in enumerate(zip(names, ims)):
    x, y = (i % cols) * (w + 10), (i // cols) * (h + 10)
    sheet.paste(im.resize((w, h)), (x, y))
    d = ImageDraw.Draw(sheet)
    d.rectangle([x, y, x + 70, y + 22], fill='red')
    d.text((x + 5, y + 5), n, fill='white')
sheet.save(f'.work/{out}', quality=85)
