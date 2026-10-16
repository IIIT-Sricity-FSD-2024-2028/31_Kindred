"""Compare frozen original captures with Phase 6 React captures (Pillow)."""
import json
from pathlib import Path
from PIL import Image, ImageChops, ImageStat, ImageDraw

root = Path(__file__).resolve().parents[2]
output = root / '.migration/phase6'
captures = output / 'final'
rows = []
for current in sorted(captures.glob('*.png')):
    slug, size = current.stem.rsplit('-', 1)
    original = root / f'.migration/reference/screenshots/{size}-{slug}.png'
    if not original.exists():
        continue
    a, b = Image.open(original).convert('RGB'), Image.open(current).convert('RGB')
    width, height = min(a.width, b.width), min(a.height, b.height)
    difference = ImageChops.difference(a.crop((0, 0, width, height)), b.crop((0, 0, width, height)))
    rows.append({'page': slug, 'viewport': size, 'originalSize': a.size, 'reactSize': b.size,
                 'heightChange': b.height-a.height,
                 'meanAbsoluteChannelDifference': round(sum(ImageStat.Stat(difference).mean)/3, 3)})
(output / 'pixel-comparison.json').write_text(json.dumps(rows, indent=2), encoding='utf-8')
for size in ['desktop', 'mobile']:
    paths = sorted(captures.glob(f'*-{size}.png'))
    for start in range(0, len(paths), 9):
        sheet = Image.new('RGB', (1500, 990), '#ddd')
        draw = ImageDraw.Draw(sheet)
        for index, current in enumerate(paths[start:start+9]):
            slug = current.stem.rsplit('-', 1)[0]
            x, y = (index % 3)*500, (index // 3)*330
            draw.text((x+4, y+4), slug+' (original | React)', fill='black')
            sources = [root / f'.migration/reference/screenshots/{size}-{slug}.png', current]
            for side, source in enumerate(sources):
                im = Image.open(source).convert('RGB')
                im = im.crop((0, 0, im.width, min(im.height, 900 if size == 'desktop' else 844)))
                im.thumbnail((240, 300))
                sheet.paste(im, (x+side*250+5, y+25))
        sheet.save(output / f'overview-{size}-{start//9+1}.jpg')
print(json.dumps({'comparedPairs': len(rows), 'note': 'Dynamic records, video frames and intended behavior changes affect pixels. No pixel-identity claim.'}))
