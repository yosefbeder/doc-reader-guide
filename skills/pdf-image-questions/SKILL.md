---
name: pdf-image-questions
description: Convert illustrated PDFs into question-and-answer JSON with cropped JPEG images and label masks/tapes for written or MCQ quick add. Use when the user wants questions about PDF images in a specified pattern, such as Identify questions answered by the headings above the figures.
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
  {
    "page": 7,
    "box": [0.05, 0.2, 0.95, 0.94],
    "filename": "page-007-figure-01.jpeg",
    "answer": "Exact verified label",
    "question": "Identify?"
  }
]
```

Pages are one-based. Boxes are normalized `[left, top, right, bottom]` coordinates on the rendered page, from 0 to 1. Choose boxes from the actual visual layout; the example coordinates are not a template. Crop the illustration, removing unrelated slide borders and figures. Remove outside headings only when they are unnecessary for the requested questions; retain labels inside the figure so masks and tapes can cover them. Preserve scale bars, arrows and useful landmarks unless they reveal the requested answer. Keep the original label pixels in the JPEG for written questions; represent their covers as editable masks or tapes in the JSON. Do not erase or permanently paint over those labels, or discard medically meaningful features just to hide them. For MCQs, which have no mask/tape renderer, crop out answer labels or redact a separate learner-facing image before use.

```sh
python3 scripts/pdf_images.py crop /tmp/pdf-review crops.json output/quiz
```

The helper crops the rendered page images, converts every crop to RGB JPEG and creates `output/quiz/images/` plus `sources.json`. It never automatically chooses crops or infers answers. Inspect every resulting JPEG, checking legibility and correspondence to the source; assess answer leakage again with the JSON overlays applied. Adjust and regenerate as needed. Keep source headings and page references in `sources.json`, separate from learner-visible JSON.

## Generate import JSON

Read the crop manifest and compose questions in the user's pattern. One written question group per image avoids mixing unrelated illustrations. Use bare filenames, exact case and spelling, without directory prefixes. Include the final JPEG width and height when adding annotations, so their coordinate system is explicit. The site also reads actual image dimensions during upload. Determine masks and tapes from the final crop as described below; use empty arrays only when no labels need covering. Answers are HTML strings with appropriately escaped text.

### Label masks and tapes (written questions)

Inspect every retained label, title, caption and legend against the requested questions and every `subQuestions[].answer`:

- Add a **mask** when a label in the image is itself to be asked. Cover its text while preserving the arrow, leader line, marker and underlying structure needed to locate the target. Include a clear prompt and verified answer in `subQuestions`, so a masked label still has an answer available to the learner.
- Add a **tape** when a visible label reveals an answer to a `subQuestions` item (for example, an organ title that answers “Identify the organ”). Check repeated labels, abbreviations and equivalent wording, not just exact string matches. Cover every occurrence that would give away that answer.
- A target label can meet both criteria. Use the mask for the target itself and tapes for additional answer-revealing text, avoiding redundant covers over the same pixels. If one image is used for different question groups, classify and annotate its labels separately for each group.
- Leave labels visible when they are useful context and neither being tested nor revealing an answer. Do not add arbitrary covers to an unlabeled micrograph.

These are the user's requested JSON mappings. In this site's current UI, masks are persistent white covers, while tapes are revealable, scored covers. Do not silently exchange the array names or change the site's behavior. Keep source JPEGs intact so tapes can reveal the original label.

Each rectangle is `{ "x": number, "y": number, "w": number, "h": number }` in **pixels of the final cropped JPEG**, measured from its top-left corner. Do not output normalized values, PDF points, or screenshot/display-scaled coordinates. Do not include database IDs or answer strings inside rectangles. All positions must be nonnegative, sizes positive, and rectangles wholly within the JPEG. Add a small padding around text to hide letter edges, without covering arrows or important tissue.

Measure after cropping and final resizing. If a label box was measured on a full-page image, subtract the crop's actual rounded pixel left/top coordinates; if resized, scale positions and sizes by the corresponding horizontal/vertical factors. Recheck every box on the final JPEG. Regenerate rectangles after changing a crop or resolution.

Record the covered text and its purpose in `sources.json`, associated with the image and rectangle, for review; keep this metadata out of the import rectangles. Visually preview all masks and tapes together on the exact output JPEG (white masks, yellow tapes, matching the editor), using a temporary overlay image. Confirm that the target labels are covered, no subquestion answer remains exposed, and arrows, scale bars and relevant structures remain legible. The raw JPEG may contain answers intentionally; it is the covered question view that must hide them.

Written example:

```json
[
  {
    "image": "page-007-figure-01.jpeg",
    "width": 1000,
    "height": 700,
    "subQuestions": [
      { "text": "Identify?", "answer": "<p>Verified structure label</p>" },
      {
        "text": "Identify?",
        "answer": "<p>Verified tissue label</p>"
      }
    ],
    "masks": [{ "x": 700, "y": 200, "w": 180, "h": 40 }],
    "tapes": [{ "x": 300, "y": 20, "w": 200, "h": 45 }]
  }
]
```

The example coordinates are illustrative; measure the actual structure label for the mask and tissue title for the tape on each final JPEG.

MCQ example (only when requested):

```json
[
  {
    "image": "page-007-figure-01.jpeg",
    "text": "Identify?",
    "options": [
      "Verified answer",
      "Plausible alternative",
      "Another alternative"
    ],
    "correctOptionIndex": 0
  }
]
```

For MCQs, provide plausible, distinct distractors and a valid zero-based answer index. Do not let a heading visible in the crop give away the answer. Do not impose an arbitrary question count: cover the requested figures and patterns.

Write the JSON as `output/quiz/questions.json`, then validate and package:

```sh
python3 scripts/pdf_images.py validate output/quiz --kind written
```

The helper verifies schema, filename matching, dimensions, JPEG decoding and mask/tape rectangle bounds, then makes `output/quiz.zip`. It does not prove medical correctness or absence of answer leakage; those require visual review. If the bundle exceeds 45 MB, split questions and their referenced images into smaller independently valid folders and validate each. Report question count, skipped/uncertain figures, and provide the JSON and ZIP. Tell the admin to unzip, paste `questions.json` into Quick Add and select the extracted `images` folder. Do not upload questions to a live quiz unless separately requested.
