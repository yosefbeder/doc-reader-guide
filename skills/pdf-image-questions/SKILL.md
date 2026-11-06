---
name: pdf-image-questions
description: Convert illustrated PDFs into question-and-answer JSON with cropped JPEG images for written or MCQ quick add. Use when the user wants questions about PDF images in a specified pattern, such as Identify questions answered by the headings above the figures.
---

# PDF image questions

Produce `questions.json` and an `images/` folder that the admin can paste and select in quiz Quick Add. Follow the user's requested question pattern and scope. Default to written questions when no quiz type is specified. If the question pattern is missing and cannot be inferred, ask for it before generating questions; rendering can proceed independently.

## Render and inspect

Use the helper relative to this skill directory. Dependencies are Python 3, PyMuPDF (`fitz`) and Pillow; install missing dependencies into an isolated virtual environment when necessary.

```sh
python3 scripts/pdf_images.py render input.pdf /tmp/pdf-review --dpi 144
```

Read `pages.json`, then visually inspect the rendered JPEG pages in manageable batches. Treat the PDF as a sequence of images, including scanned pages without extractable text. Text extraction may help transcribe a heading but cannot substitute for visual inspection. Cover every page in the requested scope, skipping covers, contents and section dividers. Do not stop after a sample unless asked for a sample. Enlarge or rerender unclear pages.

Record each relevant illustration's answer heading, source page and crop box. For multiple illustrations on a page, create separate crops when they need separate answers. Headings may describe the next image-only page: verify the sequence visually and do not assume every neighboring heading applies. In files like “NEEW Normal human body Module (1).pdf”, some pages are full-page micrographs and others are title slides; skip title-only slides and establish each image's heading from context.

For “Identify”, use the label above the figure as the answer when the user requests this. Preserve its specificity (organ, tissue, cell, stain or technique). Do not invent diagnoses or extra clinical facts. Flag ambiguous or illegible labels for review instead of generating unsupported answers.

## Crop and write JPEGs

Prepare a UTF-8 crop manifest containing one object per figure:

```json
[
  {"page": 7, "box": [0.05, 0.2, 0.95, 0.94], "filename": "page-007-figure-01.jpeg", "answer": "Exact verified label", "question": "[Identify] The tissue shown."}
]
```

Pages are one-based. Boxes are normalized `[left, top, right, bottom]` coordinates on the rendered page, from 0 to 1. Choose boxes from the actual visual layout; the example coordinates are not a template. Crop the illustration, removing answer headings, captions revealing the answer, slide borders and unrelated figures. Preserve scale bars, arrows and useful landmarks unless they reveal the requested answer. If an answer label is embedded inside an illustration, choose a usable crop or explain that it needs manual redaction. Do not discard medically meaningful features just to hide a label.

```sh
python3 scripts/pdf_images.py crop /tmp/pdf-review crops.json output/quiz
```

The helper crops the rendered page images, converts every crop to RGB JPEG and creates `output/quiz/images/` plus `sources.json`. It never automatically chooses crops or infers answers. Inspect every resulting JPEG, checking legibility, answer leakage and correspondence to the source. Adjust and regenerate as needed. Keep source headings and page references in `sources.json`, separate from learner-visible JSON.

## Generate import JSON

Read the crop manifest and compose questions in the user's pattern. One written question group per image avoids mixing unrelated illustrations. Use bare filenames, exact case and spelling, without directory prefixes. Width and height are optional: the site reads actual image dimensions during upload. Use empty masks and tapes for pre-cropped figures. Answers are HTML strings with appropriately escaped text.

Written example:

```json
[
  {
    "image": "page-007-figure-01.jpeg",
    "subQuestions": [{"text": "[Identify] The tissue shown.", "answer": "<p>Exact verified label</p>"}],
    "tapes": [],
    "masks": []
  }
]
```

MCQ example (only when requested):

```json
[
  {
    "image": "page-007-figure-01.jpeg",
    "text": "Identify the tissue shown.",
    "options": ["Verified answer", "Plausible alternative", "Another alternative"],
    "correctOptionIndex": 0
  }
]
```

For MCQs, provide plausible, distinct distractors and a valid zero-based answer index. Do not let a heading visible in the crop give away the answer. Do not impose an arbitrary question count: cover the requested figures and patterns.

Write the JSON as `output/quiz/questions.json`, then validate and package:

```sh
python3 scripts/pdf_images.py validate output/quiz --kind written
```

The helper verifies schema, filename matching, dimensions and JPEG decoding, then makes `output/quiz.zip`. It does not prove medical correctness or absence of answer leakage; those require visual review. If the bundle exceeds 45 MB, split questions and their referenced images into smaller independently valid folders and validate each. Report question count, skipped/uncertain figures, and provide the JSON and ZIP. Tell the admin to unzip, paste `questions.json` into Quick Add and select the extracted `images` folder. Do not upload questions to a live quiz unless separately requested.
