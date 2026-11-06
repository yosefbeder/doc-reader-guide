export type QuickAddKind = "written" | "mcq";

export interface QuickAddQuestion {
  image?: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

export const MAX_QUICK_ADD_BYTES = 45 * 1024 * 1024;

export function isImageUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

export function parseQuickAdd(raw: string, kind: QuickAddKind): QuickAddQuestion[] {
  let questions: unknown;
  try {
    questions = JSON.parse(raw);
  } catch {
    throw new Error("Enter a valid JSON array of questions.");
  }
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Enter a non-empty JSON array of questions.");
  }
  for (const [index, question] of questions.entries()) {
    const fail = (message: string) => {
      throw new Error(`Question ${index + 1}: ${message}`);
    };
    if (!question || typeof question !== "object" || Array.isArray(question)) {
      fail("expected an object.");
    }
    if (question.image != null && typeof question.image !== "string") {
      fail("image must be a filename.");
    }
    if (typeof question.image === "string") {
      question.image = question.image.trim();
      if (question.image && !isImageUrl(question.image) && /[/\\]/.test(question.image)) {
        fail("use an image filename without folders.");
      }
      if (kind === "written" && isImageUrl(question.image)) {
        fail("use an image filename and select its folder instead of an image URL.");
      }
    }
    if (kind === "written") {
      if (!Array.isArray(question.subQuestions) || !question.subQuestions.length ||
        question.subQuestions.some((q: any) => !q || typeof q.text !== "string" || typeof q.answer !== "string")) {
        fail("subQuestions must contain text and answer strings.");
      }
      for (const key of ["tapes", "masks"]) {
        if (question[key] == null) question[key] = [];
        if (!Array.isArray(question[key]) || question[key].some((rect: any) =>
          !rect || ["x", "y", "w", "h"].some((key) => typeof rect[key] !== "number" || !Number.isFinite(rect[key])))) {
          fail(`${key} must be an array of rectangles with numeric x, y, w and h.`);
        }
      }
    } else if (typeof question.text !== "string" || !Array.isArray(question.options) ||
      question.options.length < 2 || question.options.some((option: unknown) => typeof option !== "string") ||
      !Number.isInteger(question.correctOptionIndex) || question.correctOptionIndex < 0 ||
      question.correctOptionIndex >= question.options.length) {
      fail("provide text, at least two options and a valid zero-based correctOptionIndex.");
    }
  }
  return questions;
}

export function imageFilenames(questions: QuickAddQuestion[]) {
  return [...new Set(questions.map((q) => q.image).filter(
    (name): name is string => !!name && !isImageUrl(name)
  ))];
}

// Match exact basenames, including files nested inside the selected folder.
// Reject ambiguous matches rather than silently attaching the wrong image.
export function matchQuestionImages(names: string[], files: File[]) {
  const matches = new Map<string, File>();
  for (const name of names) {
    const candidates = files.filter((file) => file.name === name);
    if (!candidates.length) throw new Error(`Missing image: ${name}. Select its folder.`);
    if (candidates.length > 1) throw new Error(`Duplicate image filename: ${name}. Rename it so it is unique.`);
    const file = candidates[0];
    if (!file.size || !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      throw new Error(`Invalid image: ${name}. Use a non-empty JPEG, PNG, WebP or GIF.`);
    }
    matches.set(name, file);
  }
  return matches;
}
