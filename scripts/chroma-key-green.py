#!/usr/bin/env python3
"""Remove a generated chroma-green backdrop before WebP conversion.

This is for the Action Match trial, not a general-purpose background remover.
Requires Pillow: python3 -m pip install Pillow
"""

import argparse
from pathlib import Path

from PIL import Image


BACKGROUND = (6, 248, 11)  # measured from the generated solid-green image
GREEN_CUTOFF = 205
GREEN_RANGE = 220


def remove_green(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGB")
    output = Image.new("RGBA", image.size)
    result = []
    for red, green, blue in image.getdata():
        dominance = green - max(red, blue)
        if dominance >= GREEN_CUTOFF:
            result.append((0, 0, 0, 0))
            continue
        alpha = min(1.0, max(0.0, 1.0 - dominance / GREEN_RANGE))
        if alpha < 0.055:
            result.append((0, 0, 0, 0))
            continue
        if alpha < 1.0:
            # Undo green spill at anti-aliased edges before setting alpha.
            color = tuple(
                min(255, max(0, round((component - (1 - alpha) * backdrop) / alpha)))
                for component, backdrop in zip((red, green, blue), BACKGROUND)
            )
        else:
            color = (red, green, blue)
        result.append((*color, round(alpha * 255)))
    output.putdata(result)
    destination.parent.mkdir(parents=True, exist_ok=True)
    output.save(destination)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path, help="PNG with chroma-green background")
    parser.add_argument("destination", type=Path, help="RGBA PNG for WebP conversion")
    arguments = parser.parse_args()
    remove_green(arguments.source, arguments.destination)
