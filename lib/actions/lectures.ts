"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { FormState } from "@/types";
import { addMcqQuestions } from "./mcqQuizzes";
import getNumber from "@/utils/getNumber";
import replaceImgSrc from "@/utils/replaceImgSrc";

export async function addLecture(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const subjectId = getNumber(formData, "subject-id");
  const data = {
    title: formData.get("title"),
    type: "Normal",
    date: new Date(formData.get("date") as string).toISOString(),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/subjects/${subjectId}/lectures`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
      body: JSON.stringify(data),
    }
  );

  const json = await res.json();

  if (res.ok) {
    revalidatePath(`/subjects/${subjectId}`);
    revalidatePath(`/subjects/${subjectId}/update`);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function updateLecture(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const lectureId = getNumber(formData, "lecture-id");
  const subjectId = getNumber(formData, "subject-id");
  const note = formData.get("note");
  const data = {
    title: formData.get("title"),
    note: note ? replaceImgSrc(note as string, "remove") : undefined,
    date: new Date(formData.get("date") as string).toISOString(),
    subjectId,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}`,
    {
      method: "PATCH",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
      body: JSON.stringify(data),
    }
  );

  const json = await res.json();

  if (res.ok) {
    revalidatePath(`/lectures/${lectureId}`);
    revalidatePath(`/lectures/${lectureId}/update`);
    revalidatePath(`/subjects/${subjectId}`);
    revalidatePath(`/subjects/${subjectId}/update`);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function deleteLecture(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const lectureId = getNumber(formData, "lecture-id");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
    }
  );

  const json = await res.json();

  if (!res.ok)
    return { type: "fail", message: json.message, resetKey: Date.now() };

  revalidatePath(`/subjects/${json.data.lecture.subjectId}`);
  revalidatePath(`/subjects/${json.data.lecture.subjectId}/update`);

  return {};
}

export async function importSources(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const dataString = formData.get("data");
  const lectureId = getNumber(formData, "lecture-id");
  let data;
  try {
    data = JSON.parse(dataString as string);
  } catch (err) {
    return {
      type: "fail",
      message: "Invalid JSON data.",
      resetKey: Date.now(),
    };
  }
  let errors: string[] = [];
  let addedLinks = 0;
  let addedQuizzes = 0;
  let addedQuestions = 0;

  const linkResults = await Promise.all(
    (data.links || []).map(async (link: any) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}/links`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json;charset=UTF-8",
            authorization: `Bearer ${cookies().get("jwt")!.value}`,
          },
          body: JSON.stringify(link),
        }
      );
      if (res.ok) {
        return { ok: true };
      } else {
        const json = await res.json();
        return { ok: false, message: json.message || "Failed to add link" };
      }
    })
  );
  addedLinks = linkResults.filter((r) => r.ok).length;
  errors.push(...linkResults.filter((r) => !r.ok).map((r) => r.message));

  const quizResults = await Promise.all(
    (data.mcqQuizzes || []).map(async (quiz: any) => {
      const res1 = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}/mcq-quizzes`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json;charset=UTF-8",
            authorization: `Bearer ${cookies().get("jwt")!.value}`,
          },
          body: JSON.stringify({ title: quiz.title }),
        }
      );
      const json1 = await res1.json();
      if (!res1.ok) {
        return { ok: false, message: json1.message || "Failed to add quiz" };
      }
      const { totalCount, ok } = await addMcqQuestions(
        json1.data.mcqQuiz.id,
        quiz.questions
      );
      console.log(totalCount, ok);
      return { ok, totalCount };
    })
  );
  addedQuizzes = quizResults.filter((r) => r.ok).length;
  addedQuestions = quizResults.reduce((sum, r) => sum + (r.totalCount || 0), 0);
  errors.push(...quizResults.filter((r) => !r.ok).map((r) => r.message));

  revalidatePath(`/lectures/${lectureId}`);
  revalidatePath(`/lectures/${lectureId}/update`);

  return {
    type: errors.length === 0 ? "success" : "fail",
    message:
      `Added ${addedLinks} link(s), ${addedQuizzes} quiz(zes), ${addedQuestions} question(s).` +
      (errors.length ? ` Errors: ${errors.join("; ")}` : ""),
    resetKey: Date.now(),
  };
}
