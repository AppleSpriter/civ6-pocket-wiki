"""Generate the project's VI app icon without image dependencies."""

from __future__ import annotations

import struct
import sys
import zlib
from pathlib import Path


SIZE = 512
SCALE = 2
BACKGROUND = (11, 32, 43, 255)
GOLD = (222, 193, 125, 255)
INK = (18, 50, 61, 255)

HEXAGON = [(256, 450), (434, 351), (434, 161), (256, 62), (78, 161), (78, 351)]
LETTERS = [
    [(144, 188), (177, 188), (219, 317), (206, 349)],
    [(253, 188), (285, 188), (225, 349), (206, 349)],
    [(298, 188), (369, 188), (369, 211), (298, 211)],
    [(320, 188), (347, 188), (347, 349), (320, 349)],
    [(298, 326), (369, 326), (369, 349), (298, 349)],
]


def inside_polygon(x: float, y: float, polygon: list[tuple[int, int]]) -> bool:
    inside = False
    previous_x, previous_y = polygon[-1]
    for current_x, current_y in polygon:
        if (current_y > y) != (previous_y > y):
            cross_x = (previous_x - current_x) * (y - current_y) / (previous_y - current_y) + current_x
            if x < cross_x:
                inside = not inside
        previous_x, previous_y = current_x, current_y
    return inside


def color_at(x: float, y: float) -> tuple[int, int, int, int]:
    if inside_polygon(x, y, HEXAGON):
        if any(inside_polygon(x, y, letter) for letter in LETTERS):
            return INK
        return GOLD
    return BACKGROUND


def png_chunk(kind: bytes, data: bytes) -> bytes:
    return struct.pack('!I', len(data)) + kind + data + struct.pack('!I', zlib.crc32(kind + data))


def write_icon(path: Path) -> None:
    lines = bytearray()
    for y in range(SIZE):
        lines.append(0)
        for x in range(SIZE):
            samples = [color_at(x + (sx + 0.5) / SCALE, y + (sy + 0.5) / SCALE)
                       for sy in range(SCALE) for sx in range(SCALE)]
            lines.extend(sum(sample[channel] for sample in samples) // (SCALE * SCALE)
                         for channel in range(4))
    header = struct.pack('!IIBBBBB', SIZE, SIZE, 8, 6, 0, 0, 0)
    output = b'\x89PNG\r\n\x1a\n' + png_chunk(b'IHDR', header) + png_chunk(b'IDAT', zlib.compress(lines, 9)) + png_chunk(b'IEND', b'')
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(output)


if __name__ == '__main__':
    write_icon(Path(sys.argv[1]))
