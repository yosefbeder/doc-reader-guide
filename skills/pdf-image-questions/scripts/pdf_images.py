#!/usr/bin/env python3
"""Render PDF pages, crop reviewed boxes, and validate/package quiz imports."""
import argparse
import json
import math
from pathlib import Path
import zipfile


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def write_json(path, value):
    Path(path).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def render(args):
    import fitz
    if args.dpi < 72 or args.dpi > 600:
        raise ValueError("dpi must be between 72 and 600")
    args.output.mkdir(parents=True, exist_ok=True)
    pages = []
    with fitz.open(args.pdf) as document:
        for number, page in enumerate(document, 1):
            name = f"page-{number:03}.jpeg"
            pixmap = page.get_pixmap(dpi=args.dpi, colorspace=fitz.csRGB, alpha=False)
            pixmap.save(args.output / name, jpg_quality=94)
            pages.append({"page": number, "file": name, "width": pixmap.width, "height": pixmap.height})
    write_json(args.output / "pages.json", pages)
    print(f"Rendered {len(pages)} pages to {args.output}")


def crop(args):
    from PIL import Image
    pages = {row["page"]: row for row in read_json(args.pages / "pages.json")}
    rows = read_json(args.manifest)
    if not isinstance(rows, list) or not rows:
        raise ValueError("Crop manifest must be a non-empty array")
    names = set()
    # Validate all rows before writing files.
    for row in rows:
        name = row["filename"]
        box = row["box"]
        if Path(name).name != name or "/" in name or "\\" in name or not name.lower().endswith((".jpeg", ".jpg")) or name in names:
            raise ValueError(f"Invalid or duplicate JPEG filename: {name}")
        names.add(name)
        if row["page"] not in pages:
            raise ValueError(f"Unknown page: {row['page']}")
        if len(box) != 4 or any(not isinstance(x, (int, float)) or not math.isfinite(x) for x in box) or not (0 <= box[0] < box[2] <= 1 and 0 <= box[1] < box[3] <= 1):
            raise ValueError(f"Invalid normalized crop: {box}")
    images = args.output / "images"
    images.mkdir(parents=True, exist_ok=True)
    sources = []
    for row in rows:
        with Image.open(args.pages / pages[row["page"]]["file"]) as image:
            box = row["box"]
            pixels = (round(box[0] * image.width), round(box[1] * image.height), round(box[2] * image.width), round(box[3] * image.height))
            cropped = image.crop(pixels).convert("RGB")
            if cropped.width < 2 or cropped.height < 2:
                raise ValueError(f"Crop is too small: {row['filename']}")
            cropped.save(images / row["filename"], "JPEG", quality=94, optimize=True)
            sources.append({**row, "width": cropped.width, "height": cropped.height})
    write_json(args.output / "sources.json", sources)
    print(f"Created {len(sources)} JPEG crops in {images}")


def validate(args):
    from PIL import Image
    questions = read_json(args.bundle / "questions.json")
    if not isinstance(questions, list) or not questions:
        raise ValueError("questions.json must be a non-empty array")
    names = set()
    for index, question in enumerate(questions, 1):
        if not isinstance(question, dict):
            raise ValueError(f"Question {index} must be an object")
        name = question.get("image")
        if not isinstance(name, str) or Path(name).name != name or "/" in name or "\\" in name:
            raise ValueError(f"Question {index} needs a bare image filename")
        path = args.bundle / "images" / name
        with Image.open(path) as image:
            image.load()
            if image.format != "JPEG" or image.width < 2 or image.height < 2:
                raise ValueError(f"Invalid JPEG: {name}")
        names.add(name)
        if args.kind == "written":
            subs = question.get("subQuestions")
            if not isinstance(subs, list) or not subs or any(not isinstance(q, dict) or not isinstance(q.get("text"), str) or not isinstance(q.get("answer"), str) for q in subs):
                raise ValueError(f"Question {index}: invalid subQuestions")
            for key in ("tapes", "masks"):
                if question.get(key, []) != []:
                    raise ValueError(f"Question {index}: pre-cropped figures should have empty {key}")
        else:
            options = question.get("options")
            correct = question.get("correctOptionIndex")
            if not isinstance(question.get("text"), str) or not isinstance(options, list) or len(options) < 2 or any(not isinstance(o, str) for o in options) or type(correct) is not int or not 0 <= correct < len(options):
                raise ValueError(f"Question {index}: invalid MCQ schema")
    size = (args.bundle / "questions.json").stat().st_size + sum((args.bundle / "images" / name).stat().st_size for name in names)
    if size > 45 * 1024 * 1024:
        raise ValueError("Import exceeds 45 MB; split into smaller bundles")
    archive = args.bundle.with_suffix(".zip")
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as package:
        package.write(args.bundle / "questions.json", "questions.json")
        if (args.bundle / "sources.json").exists():
            package.write(args.bundle / "sources.json", "sources.json")
        for name in sorted(names):
            package.write(args.bundle / "images" / name, f"images/{name}")
    print(f"Validated {len(questions)} questions, {len(names)} images, {size:,} bytes. Packaged {archive}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    command = commands.add_parser("render")
    command.add_argument("pdf", type=Path)
    command.add_argument("output", type=Path)
    command.add_argument("--dpi", type=int, default=144)
    command.set_defaults(run=render)
    command = commands.add_parser("crop")
    command.add_argument("pages", type=Path)
    command.add_argument("manifest", type=Path)
    command.add_argument("output", type=Path)
    command.set_defaults(run=crop)
    command = commands.add_parser("validate")
    command.add_argument("bundle", type=Path)
    command.add_argument("--kind", choices=("written", "mcq"), default="written")
    command.set_defaults(run=validate)
    args = parser.parse_args()
    try:
        args.run(args)
    except (ValueError, KeyError, TypeError, OSError) as error:
        parser.exit(1, f"Error: {error}\n")


if __name__ == "__main__":
    main()
