"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { FormState } from "@/types";
import getNumber from "@/utils/getNumber";

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
  const data = {
    title: formData.get("title"),
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
