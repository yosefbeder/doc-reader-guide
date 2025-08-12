"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { FormState } from "@/types";
import getNumber from "@/utils/getNumber";

export async function updatePersonalInfo(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const data = {
    facultyId: getNumber(formData, "facultyId"),
    yearId: getNumber(formData, "yearId"),
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();

  revalidatePath("/", "page");

  return { type: res.ok ? "success" : "fail", message: json.message };
}

export async function updateUser(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = getNumber(formData, "user-id");
  const data = {
    roleId: getNumber(formData, "role-id"),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/role`,
    {
      method: "PUT",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
      body: JSON.stringify(data),
    }
  );

  const json = await res.json();

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function deleteUser(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = getNumber(formData, "user-id");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
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

  return { type: "success" };
}
