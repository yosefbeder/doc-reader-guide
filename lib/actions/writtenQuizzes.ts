"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { FormState, Quiz } from "@/types";
import getNumber from "@/utils/getNumber";
import parseSubQuestions from "@/utils/parseSubQuestions";
import { sendAutoNotification } from "@/utils/sendAutoNotification";

export async function addWrittenQuestions(
  quizId: number,
  questions: any[]
): Promise<{ successCount: number; failCount: number }> {
  if (!questions || questions.length === 0) {
    return { successCount: 0, failCount: 0 };
  }

  const jwt = cookies().get("jwt")!.value;

  const requests = questions.map(
    async ({ image, width, height, tapes, masks, subQuestions }) => {
      const fd = new FormData();
      if (image && width && height) {
        fd.append("image", image);
        fd.append("width", width);
        fd.append("height", height);
      }
      fd.append("subQuestions", JSON.stringify(subQuestions));
      fd.append("tapes", JSON.stringify(tapes));
      fd.append("masks", JSON.stringify(masks));

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/written-quizzes/${quizId}/questions`,
        {
          method: "POST",
          headers: { authorization: `Bearer ${jwt}` },
          body: fd,
        }
      );

      if (!res.ok) throw new Error("Request failed");
      return res;
    }
  );

  const results = await Promise.allSettled(requests);

  const successCount = results.filter((r) => r.status === "fulfilled").length;
  const failCount = results.length - successCount;

  return { successCount, failCount };
}

export async function addQuiz(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const lectureId = formData.get("lecture-id");
  const data = { title: formData.get("title") };
  const questionsRaw = formData.get("questions")?.toString().trim();

  let questions: any[][] = [];
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
    `${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}/written-quizzes`,
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

  const quiz = json1.data.writtenQuiz as Quiz;

  // Step 2: add questions
  const { successCount, failCount } = await addWrittenQuestions(
    quiz.id,
    questions
  );

  revalidatePath(`/lectures/${lectureId}`);
  revalidatePath(`/lectures/${lectureId}/update`);
  if (formData.get("notify"))
    sendAutoNotification(getNumber(formData, "year-id"), "written", quiz.id);

  return {
    type: res1.ok && (failCount === 0 || successCount > 0) ? "success" : "fail",
    message:
      questions.length > 0
        ? `Added ${successCount} group(s), ${failCount} failed`
        : json1.message,
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
    `${process.env.NEXT_PUBLIC_API_URL}/written-quizzes/${quizId}`,
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
    revalidatePath(`/written-quizzes/${quizId}`);
    revalidatePath(`/written-quizzes/${quizId}/update`);
    if (formData.get("notify"))
      sendAutoNotification(getNumber(formData, "year-id"), "written", quizId);
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
    `${process.env.NEXT_PUBLIC_API_URL}/written-quizzes/${quizId}`,
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

  revalidatePath(`/lectures/${json.data.writtenQuiz.lectureId}`);
  revalidatePath(`/lectures/${json.data.writtenQuiz.lectureId}/update`);
  revalidatePath(`/written-quizzes/${quizId}`);
  revalidatePath(`/written-quizzes/${quizId}/update`);

  return {};
}

export async function addQuestion(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const quizId = getNumber(formData, "quiz-id");
  formData.set("subQuestions", JSON.stringify(parseSubQuestions(formData)));
  if ((formData.get("image") as File).size === 0) formData.delete("image");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/written-quizzes/${quizId}/questions`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
      body: formData,
    }
  );

  const json = await res.json();

  if (res.ok) {
    revalidatePath(`/written-quizzes/${quizId}`);
    revalidatePath(`/written-quizzes/${quizId}/update`);
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
  const data = {
    tapes: JSON.parse(formData.get("tapes") as string),
    masks: JSON.parse(formData.get("masks") as string),
    subQuestions: parseSubQuestions(formData),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/written-questions/${questionId}`,
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
    revalidatePath(`/written-quizzes/${quizId}`);
    revalidatePath(`/written-quizzes/${quizId}/update`);
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
    `${process.env.NEXT_PUBLIC_API_URL}/written-questions/${questionId}`,
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

  revalidatePath(`/written-quizzes/${json.data.writtenQuestion.quizId}`);
  revalidatePath(`/written-quizzes/${json.data.writtenQuestion.quizId}/update`);

  return {};
}

export async function quickAdd(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const questionsRaw = formData.get("questions")?.toString().trim();
  const quizId = getNumber(formData, "quiz-id");

  let questions: any[][] = [];
  try {
    questions = questionsRaw ? JSON.parse(questionsRaw) : [];
    if (!Array.isArray(questions)) throw new Error();
  } catch {
    return {
      type: "fail",
      message: "Quick add failed 😭, invalid JSON format",
    };
  }

  const { successCount, failCount } = await addWrittenQuestions(
    quizId,
    questions
  );

  if (successCount > 0) {
    revalidatePath(`/written-quizzes/${quizId}`);
    revalidatePath(`/written-quizzes/${quizId}/update`);
    if (formData.get("notify"))
      sendAutoNotification(getNumber(formData, "year-id"), "written", quizId);
  }

  return {
    type: successCount > 0 ? "success" : "fail",
    message: `Added ${successCount} group(s), ${failCount} failed`,
    resetKey: Date.now(),
  };
}
