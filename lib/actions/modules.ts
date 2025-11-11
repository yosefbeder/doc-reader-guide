"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { FormState } from "@/types";
import getNumber from "@/utils/getNumber";

export async function addModule(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const yearId = getNumber(formData, "year-id");
  const data = {
    icon: formData.get("icon"),
    name: formData.get("name"),
    semesterName: getNumber(formData, "semester-name"),
    customGPT: formData.get("custom-gpt") || undefined,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/years/${yearId}/modules`,
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
    revalidatePath("/", "page");
    revalidatePath("/update", "page");
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function updateModule(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const moduleId = getNumber(formData, "module-id");
  const data = {
    icon: formData.get("icon"),
    name: formData.get("name"),
    semesterName: getNumber(formData, "semester-name"),
    customGPT: formData.get("custom-gpt") || null,
  };

  console.log(data);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/modules/${moduleId}`,
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
    revalidatePath(`/modules/${moduleId}`);
    revalidatePath("/", "page");
    revalidatePath("/update", "page");
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function deleteModule(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const moduleId = getNumber(formData, "module-id");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/modules/${moduleId}`,
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

  revalidatePath(`/modules/${json.data.module.id}`);
  revalidatePath("/", "page");
  revalidatePath("/update", "page");

  return {};
}
