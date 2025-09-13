"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { FormState, Quiz } from "@/types";
import getNumber from "@/utils/getNumber";
import parseOptions from "@/utils/parseOptions";
import { sendAutoNotification } from "@/utils/sendAutoNotification";

export async function addMcqQuestions(
  quizId: number,
  questions: any[]
): Promise<{ totalCount: number; ok: boolean }> {
  if (!questions || questions.length === 0) {
    return { totalCount: 0, ok: true };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mcq-quizzes/${quizId}/questions`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
      body: JSON.stringify(questions),
    }
  );

  if (!res.ok) {
    return { totalCount: 0, ok: false };
  }

  const json = await res.json();
  return { totalCount: json.totalCount ?? 0, ok: true };
}

export async function addQuiz(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const lectureId = formData.get("lecture-id");
  const data = { title: formData.get("title") };
  const questionsRaw = formData.get("questions")?.toString().trim();

  let questions: any[] = [];
  try {
    questions = questionsRaw ? JSON.parse(questionsRaw) : [];
    if (!Array.isArray(questions)) throw new Error();
  } catch {
    return {
      type: "fail",
      message: "Quick add failed 😭, invalid JSON format",
      resetKey: Date.now(),
    };
  }

  // Step 1: create quiz
  const res1 = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}/mcq-quizzes`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
      body: JSON.stringify(data),
    }
  );

  const json1 = await res1.json();

  if (!res1.ok) {
    return {
      type: "fail",
      message: json1.message,
      resetKey: Date.now(),
    };
  }

  const quiz = json1.data.mcqQuiz as Quiz;

  // Step 2: add questions
  const { totalCount, ok } = await addMcqQuestions(quiz.id, questions);

  revalidatePath(`/lectures/${lectureId}`);
  revalidatePath(`/lectures/${lectureId}/update`);
  if (formData.get("notify"))
    sendAutoNotification(getNumber(formData, "year-id"), "mcq", quiz.id);

  return {
    type: res1.ok && ok ? "success" : "fail",
    message:
      questions.length > 0 ? `${totalCount} question(s) added` : json1.message,
    resetKey: Date.now(),
  };
}

export async function updateQuiz(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const quizId = getNumber(formData, "quiz-id");
  const lectureId = getNumber(formData, "lecture-id");
  const data = {
    title: formData.get("title"),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mcq-quizzes/${quizId}`,
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
    revalidatePath(`/mcq-quizzes/${quizId}`);
    revalidatePath(`/mcq-quizzes/${quizId}/update`);
    if (formData.get("notify"))
      sendAutoNotification(getNumber(formData, "year-id"), "mcq", quizId);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function deleteQuiz(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const quizId = formData.get("quiz-id");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mcq-quizzes/${quizId}`,
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

  revalidatePath(`/lectures/${json.data.mcqQuiz.lectureId}`);
  revalidatePath(`/lectures/${json.data.mcqQuiz.lectureId}/update`);
  revalidatePath(`/mcq-quizzes/${quizId}`);
  revalidatePath(`/mcq-quizzes/${quizId}/update`);

  return {};
}

export async function addQuestion(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const quizId = getNumber(formData, "quiz-id");
  const image = formData.has("image")
    ? formData.get("image")!.toString().trim()
    : undefined;
  const explanation = formData.has("explanation")
    ? formData.get("explanation")!.toString().trim()
    : undefined;

  const data = [
    {
      text: formData.get("text"),
      image,
      explanation,
      ...parseOptions(formData),
    },
  ];

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mcq-quizzes/${quizId}/questions`,
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
    revalidatePath(`/mcq-quizzes/${quizId}`);
    revalidatePath(`/mcq-quizzes/${quizId}/update`);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function updateQuestion(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const quizId = getNumber(formData, "quiz-id");
  const questionId = getNumber(formData, "question-id");
  const image = formData.has("image")
    ? formData.get("image")!.toString().trim()
    : "";
  const explanation = formData.has("explanation")
    ? formData.get("explanation")!.toString().trim()
    : "";

  const data = {
    text: formData.get("text"),
    image,
    explanation,
    ...parseOptions(formData),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mcq-questions/${questionId}`,
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
    revalidatePath(`/mcq-quizzes/${quizId}`);
    revalidatePath(`/mcq-quizzes/${quizId}/update`);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function deleteQuestion(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const questionId = formData.get("question-id");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mcq-questions/${questionId}`,
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

  revalidatePath(`/mcq-quizzes/${json.data.mcqQuestion.quizId}`);
  revalidatePath(`/mcq-quizzes/${json.data.mcqQuestion.quizId}/update`);

  return {};
}

export async function quickAdd(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const questionsRaw = formData.get("questions")?.toString().trim();
  const quizId = getNumber(formData, "quiz-id");

  let questions: any[] = [];
  try {
    questions = questionsRaw ? JSON.parse(questionsRaw) : [];
    if (!Array.isArray(questions)) throw new Error();
  } catch {
    return {
      type: "fail",
      message: "Quick add failed 😭, invalid JSON format",
    };
  }

  const { totalCount, ok } = await addMcqQuestions(quizId, questions);

  if (ok) {
    revalidatePath(`/written-quizzes/${quizId}`);
    revalidatePath(`/written-quizzes/${quizId}/update`);
  }

  return {
    type: ok ? "success" : "fail",
    message: ok
      ? `${totalCount} question(s) added`
      : "Quick add failed 😭, please try a different AI model",
    resetKey: Date.now(),
  };
}
