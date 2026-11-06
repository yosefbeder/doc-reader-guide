"use client";

import { useActionState, useId, useState } from "react";
import ButtonSubmit from "@/components/ButtonSubmit";
import Checkbox from "@/components/Checkbox";
import Message from "@/components/Message";
import { FormState } from "@/types";
import { imageFilenames, matchQuestionImages, MAX_QUICK_ADD_BYTES, parseQuickAdd, QuickAddKind } from "@/utils/quickAddImages";

function imageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Cannot read image: ${file.name}`));
    };
    image.src = url;
  });
}

export default function QuickAddQuestionsForm({ quizId, kind, action }: {
  quizId: number;
  kind: QuickAddKind;
  action: (state: FormState, data: FormData) => Promise<FormState>;
}) {
  const id = useId();
  const [questions, setQuestions] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [folderKey, setFolderKey] = useState(0);
  const [progress, setProgress] = useState("");
  // Keep successful uploads across retries if a later upload fails.
  const [uploads] = useState(() => new Map<File, string>());
  let names: string[] = [];
  let validationError = "";
  try {
    names = imageFilenames(parseQuickAdd(questions, kind));
  } catch (error) {
    if (questions.trim()) validationError = (error as Error).message;
  }
  let imageError = "";
  if (names.length) {
    try { matchQuestionImages(names, files); }
    catch (error) { imageError = (error as Error).message; }
  }

  const [formState, formAction, pending] = useActionState(async (state: FormState, data: FormData): Promise<FormState> => {
    try {
      const parsed = parseQuickAdd(questions, kind);
      const matched = matchQuestionImages(imageFilenames(parsed), files);
      const size = new Blob([questions]).size + [...matched.values()].reduce((sum, file) => sum + file.size, 0);
      if (size > MAX_QUICK_ADD_BYTES) throw new Error("This import exceeds 45 MB. Split it into smaller batches.");
      const dimensions = new Map<string, { width: number; height: number }>();
      // Decode every image before uploading or creating any questions.
      for (const [name, file] of matched) dimensions.set(name, await imageDimensions(file));
      const urls = new Map<string, string>();
      for (const [name, file] of matched) {
        if (kind === "written") {
          data.append("images", file, name);
        } else {
          setProgress(`Uploading ${name}…`);
          let publicUrl = uploads.get(file);
          if (!publicUrl) {
            const extension = { "image/jpeg": "jpeg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" }[file.type];
            const key = `question-images/${crypto.randomUUID()}.${extension}`;
            const response = await fetch(`/api/r2/presigned-url?${new URLSearchParams({ file: key, type: file.type })}`);
            if (!response.ok) throw new Error(`Could not start upload: ${name}.`);
            const signed = await response.json();
            const upload = await fetch(signed.signedUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
            if (!upload.ok) throw new Error(`Upload failed: ${name}. Try again.`);
            publicUrl = signed.publicUrl as string;
            uploads.set(file, publicUrl);
          }
          urls.set(name, publicUrl);
        }
      }
      data.set("questions", JSON.stringify(parsed.map((question) => {
        if (!question.image || !matched.has(question.image)) return question;
        return kind === "written"
          ? { ...question, ...dimensions.get(question.image) }
          : { ...question, image: urls.get(question.image) };
      })));
      setProgress("Adding questions…");
      const result = await action(state, data);
      if (result.type === "success") {
        setQuestions("");
        setFiles([]);
        uploads.clear();
        setFolderKey((key) => key + 1);
      }
      return result;
    } catch (error) {
      return { type: "fail", message: error instanceof Error ? error.message : "Import failed. Please try again." };
    } finally { setProgress(""); }
  }, {});

  return (
    <form action={formAction}>
      <fieldset disabled={pending}>
        <input type="hidden" name="quiz-id" value={quizId} />
        <label htmlFor={`${id}-questions`} className="block mb-2">JSON</label>
        <textarea name="questions" id={`${id}-questions`} className="block mb-4" required value={questions} onChange={(e) => setQuestions(e.target.value)} />
        <p className="mb-4 text-sm">For an image, include <code>{'"image": "slide-001.jpeg"'}</code> in the question object, then select the folder containing it. Filenames must match exactly. JPEG, PNG, WebP and GIF are supported. Maximum import: 45 MB.</p>
        {validationError && <Message type="fail" className="mb-4">{validationError}</Message>}
        {names.length > 0 && <div className="mb-4">
          <label htmlFor={`${id}-images`} className="block mb-2">Images folder ({names.length} referenced)</label>
          <input key={folderKey} id={`${id}-images`} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple {...{ webkitdirectory: "", directory: "" }} onChange={(e) => { setFiles(Array.from(e.target.files ?? [])); uploads.clear(); }} />
          <ul className="my-2 text-sm">{names.map((name) => <li key={name}>{name}: {files.filter((file) => file.name === name).length === 1 ? "matched" : "missing or duplicate"}</li>)}</ul>
          {imageError && <Message type="fail">{imageError}</Message>}
        </div>}
        <div className="block mb-4"><Checkbox label="Notify?" name="notify" /></div>
        {formState.message && formState.type && <Message type={formState.type} className="mb-4">{formState.message}</Message>}
        <p role="status" aria-live="polite">{progress}</p>
        <ButtonSubmit disabled={!questions.trim() || !!validationError || !!imageError}>Add</ButtonSubmit>
      </fieldset>
    </form>
  );
}
