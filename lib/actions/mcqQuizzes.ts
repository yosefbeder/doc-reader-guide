"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { FormState } from "@/types";
import getNumber from "@/utils/getNumber";
import parseOptions from "@/utils/parseOptions";

export async function addQuiz(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const lectureId = formData.get("lecture-id");
  const data = {
    title: formData.get("title"),
  };
  const questions = formData.get("questions")?.toString().trim();

  if (questions) {
    try {
      JSON.parse(questions);
    } catch (error) {
      return {
        type: "fail",
        message: "Quick add failed 😭, please try a different AI model",
        resetKey: Date.now(),
      };
    }
  }

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
  let res2;

  const json1 = await res1.json();

  let json2;

  if (res1.ok) {
    if (questions) {
      res2 = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/mcq-quizzes/${json1.data.mcqQuiz.id}/questions`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json;charset=UTF-8",
            authorization: `Bearer ${cookies().get("jwt")!.value}`,
          },
          body: questions,
        }
      );
      json2 = await res2.json();
    }

    revalidatePath(`/lectures/${lectureId}`);
    revalidatePath(`/lectures/${lectureId}/update`);
  }

  if (res2 && json2) {
    return {
      type: res1.ok && res2.ok ? "success" : "fail",
      message: `${json2.totalCount} question(s) added`,
      resetKey: Date.now(),
    };
  } else
    return {
      type: res1.ok ? "success" : "fail",
      message: json1.message,
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
  const questions = formData.get("questions")?.toString().trim();
  const quizId = getNumber(formData, "quiz-id");

  if (questions) {
    try {
      JSON.parse(questions);
    } catch (error) {
      return {
        type: "fail",
        message: "Quick add failed 😭, please try a different AI model",
      };
    }
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/mcq-quizzes/${quizId}/questions`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
      body: questions,
    }
  );

  const json = await res.json();

  if (res.ok) {
    revalidatePath(`/mcq-quizzes/${quizId}`);
    revalidatePath(`/mcq-quizzes/${quizId}/update`);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: res.ok
      ? `${json.totalCount} question(s) added`
      : "Quick add failed 😭, please try a different AI model",
    resetKey: Date.now(),
  };
}
