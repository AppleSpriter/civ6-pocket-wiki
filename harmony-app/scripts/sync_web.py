"""Copy the current web wiki into HarmonyOS rawfile assets."""

from __future__ import annotations

import shutil
from pathlib import Path


PROJECT = Path(__file__).resolve().parents[1]
SOURCE = PROJECT.parent / 'civ6-pocket' / 'dist'
TARGET = PROJECT / 'entry' / 'src' / 'main' / 'resources' / 'rawfile' / 'web'


def main() -> None:
    required = ['index.html', 'style.css', 'app.js', 'data.json', 'images']
    missing = [name for name in required if not (SOURCE / name).exists()]
    if missing:
        raise FileNotFoundError(f'Missing web assets: {missing}')

    if TARGET.exists():
        shutil.rmtree(TARGET)
    shutil.copytree(SOURCE, TARGET)
    print(f'Copied {sum(path.is_file() for path in TARGET.rglob("*"))} files to {TARGET}')


if __name__ == '__main__':
    main()
