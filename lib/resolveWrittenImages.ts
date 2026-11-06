import { imageFilenames, matchQuestionImages, MAX_QUICK_ADD_BYTES, QuickAddQuestion } from "@/utils/quickAddImages";

// The browser uploads images directly to R2, keeping binary data out of the
// server-action request and the site's reverse proxy body limit.
export default async function resolveWrittenImages(
  questions: QuickAddQuestion[],
  formData: FormData
) {
  const names = imageFilenames(questions);
  const files = formData.getAll("images").filter((entry): entry is File => typeof entry !== "string");
  if (!names.length || files.length) return matchQuestionImages(names, files);

  const raw = formData.get("uploaded-images");
  if (typeof raw !== "string") throw new Error("Select the images folder and upload its images first.");
  let uploads: unknown;
  try { uploads = JSON.parse(raw); }
  catch { throw new Error("Invalid uploaded images. Select the images folder again."); }
  if (!uploads || typeof uploads !== "object" || Array.isArray(uploads)) {
    throw new Error("Invalid uploaded images.");
  }
  const base = process.env.NEXT_PUBLIC_R2_URL?.replace(/\/$/, "");
  if (!base) throw new Error("Image storage is not configured.");
  const urls = new Map<string, string>();
  // Validate every location before fetching; never fetch arbitrary client URLs.
  for (const name of names) {
    const url = Object.prototype.hasOwnProperty.call(uploads, name)
      ? (uploads as Record<string, unknown>)[name] : undefined;
    const prefix = `${base}/question-images/`;
    if (typeof url !== "string" || !url.startsWith(prefix) ||
      !/^[\da-f-]{36}\.(jpeg|png|webp|gif)$/.test(url.slice(prefix.length))) {
      throw new Error(`Missing or invalid upload: ${name}. Select its folder again.`);
    }
    urls.set(name, url);
  }
  const resolved: File[] = [];
  let total = new Blob([formData.get("questions")?.toString() ?? ""]).size;
  for (const [name, url] of urls) {
    const response = await fetch(url, { redirect: "error", cache: "no-store" });
    if (!response.ok || !response.body) throw new Error(`Could not read uploaded image: ${name}.`);
    const type = response.headers.get("content-type")?.split(";")[0].trim() ?? "";
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(type)) {
      await response.body.cancel();
      throw new Error(`Invalid uploaded image: ${name}.`);
    }
    const reader = response.body.getReader();
    const chunks: Uint8Array<ArrayBuffer>[] = [];
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.byteLength;
        if (total > MAX_QUICK_ADD_BYTES) {
          await reader.cancel();
          throw new Error("This import exceeds 45 MB. Split it into smaller batches.");
        }
        chunks.push(value);
      }
    } finally { reader.releaseLock(); }
    resolved.push(new File(chunks, name, { type }));
  }
  return matchQuestionImages(names, resolved);
}
