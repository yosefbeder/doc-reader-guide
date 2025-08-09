"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { FormState } from "@/types";
import getNumber from "@/utils/getNumber";
import parseOptions from "@/utils/parseOptions";
import parseWrittenQuestions from "@/utils/parseWrittenQuestions";
import parseUrls from "@/utils/parseUrls";

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
    `${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}/quizzes`,
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
        `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${json1.data.id}/questions`,
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

  if (res2 && json2)
    return {
      type: res1.ok && res2.ok ? "success" : "fail",
      message: `${json1.message}\n ${json2.data.count} question(s) added`,
      resetKey: Date.now(),
    };
  else
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
    `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}`,
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
    revalidatePath(`/quizzes/${quizId}`);
    revalidatePath(`/quizzes/${quizId}/update`);
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
    `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}`,
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

  revalidatePath(`/lectures/${json.data.lectureId}`);
  revalidatePath(`/lectures/${json.data.lectureId}/update`);
  revalidatePath(`/quizzes/${quizId}`);
  revalidatePath(`/quizzes/${quizId}/update`);

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
    `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}/questions`,
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
    revalidatePath(`/quizzes/${quizId}`);
    revalidatePath(`/quizzes/${quizId}/update`);
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
    `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}`,
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
    revalidatePath(`/quizzes/${quizId}`);
    revalidatePath(`/quizzes/${quizId}/update`);
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
    `${process.env.NEXT_PUBLIC_API_URL}/questions/${questionId}`,
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

  revalidatePath(`/quizzes/${json.data.quizId}`);
  revalidatePath(`/quizzes/${json.data.quizId}/update`);

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
    `${process.env.NEXT_PUBLIC_API_URL}/quizzes/${quizId}/questions`,
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
    revalidatePath(`/quizzes/${quizId}`);
    revalidatePath(`/quizzes/${quizId}/update`);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: res.ok
      ? `${json.data.count} question(s) added`
      : "Quick add failed 😭, please try a different AI model",
    resetKey: Date.now(),
  };
}

export async function addPracticalQuiz(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const lectureId = formData.get("lecture-id");
  const data = {
    title: formData.get("title"),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}/practical-quizzes`,
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
    revalidatePath(`/lectures/${lectureId}`);
    revalidatePath(`/lectures/${lectureId}/update`);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function updatePracticalQuiz(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const quizId = getNumber(formData, "quiz-id");
  const lectureId = getNumber(formData, "lecture-id");
  const data = {
    title: formData.get("title"),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/practical-quizzes/${quizId}`,
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
    revalidatePath(`/practical-quizzes/${quizId}`);
    revalidatePath(`/practical-quizzes/${quizId}/update`);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function deletePracticalQuiz(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const quizId = formData.get("quiz-id");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/practical-quizzes/${quizId}`,
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

  revalidatePath(`/lectures/${json.data.lectureId}`);
  revalidatePath(`/lectures/${json.data.lectureId}/update`);
  revalidatePath(`/practical-quizzes/${quizId}`);
  revalidatePath(`/practical-quizzes/${quizId}/update`);

  return {};
}

export async function addPracticalQuestion(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const quizId = getNumber(formData, "quiz-id");
  formData.set(
    "writtenQuestions",
    JSON.stringify(parseWrittenQuestions(formData))
  );
  if ((formData.get("image") as File).size === 0) formData.delete("image");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/practical-quizzes/${quizId}/practical-questions`,
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
    revalidatePath(`/practical-quizzes/${quizId}`);
    revalidatePath(`/practical-quizzes/${quizId}/update`);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function updatePracticalQuestion(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const quizId = getNumber(formData, "quiz-id");
  const questionId = getNumber(formData, "question-id");
  const data = {
    tapes: JSON.parse(formData.get("tapes") as string),
    masks: JSON.parse(formData.get("masks") as string),
    writtenQuestions: parseWrittenQuestions(formData),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/practical-questions/${questionId}`,
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
    revalidatePath(`/practical-quizzes/${quizId}`);
    revalidatePath(`/practical-quizzes/${quizId}/update`);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function deletePracticalQuestion(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const questionId = formData.get("question-id");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/practical-questions/${questionId}`,
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

  revalidatePath(`/practical-quizzes/${json.data.quizId}`);
  revalidatePath(`/practical-quizzes/${json.data.quizId}/update`);

  return {};
}
