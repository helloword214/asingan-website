#!/usr/bin/env python3
"""
Create standardized personnel image copies without touching the originals.

Source images stay in:
  public/images/mock-personnel/personnels
  public/images/mock-personnel/fire-marshals

Derived images are written to:
  public/images/derived/mock-personnel/personnels
  public/images/derived/mock-personnel/fire-marshals

The website can safely use the derived copies when they exist while keeping
the original uploaded files untouched for rollback or future reprocessing.
"""

from __future__ import annotations

import argparse
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageOps


SUPPORTED_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp"}
DEFAULT_JOBS = [
  (
    Path("public/images/mock-personnel/personnels"),
    Path("public/images/derived/mock-personnel/personnels"),
  ),
  (
    Path("public/images/mock-personnel/fire-marshals"),
    Path("public/images/derived/mock-personnel/fire-marshals"),
  ),
]


@dataclass
class RenderConfig:
  width: int
  height: int
  quality: int
  force: bool


def parse_args() -> argparse.Namespace:
  parser = argparse.ArgumentParser(description="Generate standardized personnel image copies.")
  parser.add_argument("--width", type=int, default=800, help="Output width in pixels.")
  parser.add_argument("--height", type=int, default=1000, help="Output height in pixels.")
  parser.add_argument("--quality", type=int, default=90, help="JPEG/WebP export quality.")
  parser.add_argument("--force", action="store_true", help="Rebuild even when output is newer than source.")
  return parser.parse_args()


def collect_images(source_dir: Path) -> list[Path]:
  return sorted(
    path
    for path in source_dir.iterdir()
    if path.is_file() and path.suffix.lower() in SUPPORTED_SUFFIXES
  )


def compute_crop_box(width: int, height: int, target_ratio: float) -> tuple[int, int, int, int]:
  source_ratio = width / height

  if source_ratio > target_ratio:
    crop_width = int(round(height * target_ratio))
    crop_height = height
    left = max(0, (width - crop_width) // 2)
    top = 0
  else:
    crop_width = width
    crop_height = int(round(width / target_ratio))
    left = 0
    extra_height = max(0, height - crop_height)
    # Keep more of the head/upper body by cropping a bit more from the bottom.
    top = int(round(extra_height * 0.22))

  return (left, top, left + crop_width, top + crop_height)


def render_standard_copy(source_path: Path, output_path: Path, config: RenderConfig) -> None:
  output_path.parent.mkdir(parents=True, exist_ok=True)

  if (
    not config.force
    and output_path.exists()
    and output_path.stat().st_mtime >= source_path.stat().st_mtime
  ):
    return

  with Image.open(source_path) as source_image:
    image = ImageOps.exif_transpose(source_image).convert("RGB")
    crop_box = compute_crop_box(image.width, image.height, config.width / config.height)
    cropped = image.crop(crop_box)
    rendered = cropped.resize((config.width, config.height), Image.Resampling.LANCZOS)

    save_options: dict[str, int | bool] = {"optimize": True}
    suffix = output_path.suffix.lower()

    if suffix in {".jpg", ".jpeg", ".webp"}:
      save_options["quality"] = config.quality

    rendered.save(output_path, **save_options)


def main() -> int:
  args = parse_args()

  config = RenderConfig(
    width=args.width,
    height=args.height,
    quality=args.quality,
    force=args.force,
  )

  written = 0
  skipped = 0
  processed_sources = 0

  for source_dir, output_dir in DEFAULT_JOBS:
    if not source_dir.exists():
      raise SystemExit(f"Source directory not found: {source_dir}")

    images = collect_images(source_dir)
    if not images:
      print(f"No supported images found in {source_dir}")
      continue

    processed_sources += 1
    print(f"\nProcessing {source_dir} -> {output_dir}")

    for source_path in images:
      output_path = output_dir / source_path.name
      output_existed = output_path.exists()
      output_mtime_before = output_path.stat().st_mtime if output_existed else None

      render_standard_copy(source_path, output_path, config)

      output_exists_now = output_path.exists()
      output_mtime_after = output_path.stat().st_mtime if output_exists_now else None

      if output_exists_now and output_mtime_after != output_mtime_before:
        written += 1
        print(f"prepared {output_path}")
      else:
        skipped += 1
        print(f"skipped  {output_path}")

  if processed_sources == 0:
    print("No configured source folders contained supported images.")
    return 0

  print(
    f"\nDone. {written} standardized copy/copies prepared across {processed_sources} folder(s). "
    f"{skipped} file(s) were already up to date. Originals stayed untouched in the source folders."
  )
  return 0


if __name__ == "__main__":
  raise SystemExit(main())
