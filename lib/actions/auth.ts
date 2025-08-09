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
