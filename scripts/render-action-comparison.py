#!/usr/bin/env python3
"""Render a static before/after contact sheet and enlarged edge proof."""

from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parent.parent
OLD = ROOT / "action-put-boy-v3.png.webp"
NEW = ROOT / "private-prototypes/action-put-boy-v4-cutout.webp"
OUT = ROOT / "private-prototypes"
OLD_IMAGE = Image.open(OLD).convert("RGBA")
NEW_IMAGE = Image.open(NEW).convert("RGBA")

sheet = Image.new("RGB", (1680, 1070), "#fff4df")
draw = ImageDraw.Draw(sheet)
for x, label, picture in [(20, "CURRENT  action-put-boy-v3.png.webp", OLD_IMAGE), (860, "TRIAL  action-put-boy-v4-cutout.webp", NEW_IMAGE)]:
    draw.rounded_rectangle((x, 18, x + 800, 1040), radius=24, fill="white")
    draw.text((x + 18, 34), label, fill="#49372f")
    for y, background in [(80, "#fff7ed"), (545, "#b9d9ec")]:
        draw.rounded_rectangle((x + 10, y, x + 790, y + 450), radius=18, fill=background)
        layer = Image.new("RGBA", picture.size, background)
        layer.alpha_composite(picture)
        sheet.paste(layer.convert("RGB").resize((780, 439), Image.Resampling.LANCZOS), (x + 10, y + 5))
sheet.save(OUT / "action-put-boy-comparison.png")

# Hair edge, raised hand and upper table edge, 4x enlargement on two colors.
crop = NEW_IMAGE.crop((5, 25, 300, 300)).resize((1180, 1100), Image.Resampling.NEAREST)
proof = Image.new("RGB", (2360, 1100), "#fff4df")
for x, background in [(0, "#f8d9d9"), (1180, "#b9d9ec")]:
    layer = Image.new("RGBA", crop.size, background)
    layer.alpha_composite(crop)
    proof.paste(layer.convert("RGB"), (x, 0))
proof.save(OUT / "action-put-boy-edge-zoom.png")
