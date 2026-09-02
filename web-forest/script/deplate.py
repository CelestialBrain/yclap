#!/usr/bin/env python3
"""Remove the baked-in paper plate behind a generated sticker asset.

Every PNG in `src/asset/` shipped fully opaque with a cream rectangle behind the
drawing, which is why encounter discs rendered as cream SQUARES on the map and
the nav glyphs sat on tiles. The creams were not even consistent
(#FBFAF1 / #EBE5CF / #E7E3CB).

A global colour key is the wrong tool: the same cream is a legitimate FILL
inside the artwork (bottle bodies, the pin's paper well, the check plate), so
keying by colour punches holes in the drawing. Instead this flood-fills the
region CONNECTED TO THE BORDER, which is the plate and nothing else.

Edge pixels get proportional alpha rather than a binary cut, so the dark contour
keeps its antialiasing instead of gaining a cream fringe.

    python3 script/deplate.py            # rewrite in place, original kept once
    python3 script/deplate.py --check    # report only
"""

from __future__ import annotations

import argparse
import pathlib
import sys
from collections import deque

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
ASSET = ROOT / "src" / "asset"
BACKUP = ROOT / "script" / "asset-with-plate"

# Inside this distance of the sampled plate colour a border-connected pixel is
# plate. Wide enough for the JPEG-ish noise in the generations, narrow enough to
# stop at the ink contour (which is ~200 away).
SOLID = 26
# Between SOLID and FEATHER the pixel is an antialiased edge: keep the colour,
# scale the alpha by how far it has travelled from the plate.
FEATHER = 96


def plate_color(im: Image.Image) -> tuple[int, int, int]:
    """Most common colour along the four borders."""
    w, h = im.size
    px = im.load()
    tally: dict[tuple[int, int, int], int] = {}
    for x in range(w):
        for y in (0, h - 1):
            key = px[x, y][:3]
            tally[key] = tally.get(key, 0) + 1
    for y in range(h):
        for x in (0, w - 1):
            key = px[x, y][:3]
            tally[key] = tally.get(key, 0) + 1
    return max(tally.items(), key=lambda kv: kv[1])[0]


def distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2) ** 0.5


def deplate(im: Image.Image) -> tuple[Image.Image, float]:
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    ground = plate_color(im)

    alpha = [[255] * w for _ in range(h)]
    seen = [[False] * w for _ in range(h)]
    queue: deque[tuple[int, int]] = deque()

    for x in range(w):
        for y in (0, h - 1):
            queue.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            queue.append((x, y))

    cleared = 0
    while queue:
        x, y = queue.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or seen[y][x]:
            continue
        seen[y][x] = True
        d = distance(px[x, y][:3], ground)
        if d > FEATHER:
            continue  # hit the drawing — stop, do not cross the contour
        if d <= SOLID:
            alpha[y][x] = 0
            cleared += 1
        else:
            # Antialiased rim: the further from the plate, the more opaque.
            alpha[y][x] = int(255 * (d - SOLID) / (FEATHER - SOLID))
        queue.extend(((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)))

    out = Image.new("RGBA", (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            op[x, y] = (r, g, b, alpha[y][x])
    return out, cleared / (w * h)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="report, do not write")
    ap.add_argument("path", nargs="*", help="specific files (default: all of src/asset)")
    arg = ap.parse_args()

    target = [pathlib.Path(p).resolve() for p in arg.path] or sorted(ASSET.rglob("*.png"))
    worst = 0.0
    for path in target:
        im = Image.open(path)
        already = im.mode == "RGBA" and im.getchannel("A").getextrema()[0] < 255
        if already:
            print(f"skip  {path.relative_to(ROOT)}  already has transparency")
            continue
        out, share = deplate(im)
        worst = max(worst, share)
        print(f"{'would ' if arg.check else ''}key  {path.relative_to(ROOT)}  {share:.1%} cleared")
        if share < 0.02:
            print(f"  WARN plate under 2% — border may not be a plate; left alone", file=sys.stderr)
            continue
        if not arg.check:
            # Originals live outside src/ so Vite never bundles them.
            backup = BACKUP / path.relative_to(ASSET)
            backup.parent.mkdir(parents=True, exist_ok=True)
            if not backup.exists():
                im.save(backup)
            out.save(path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
