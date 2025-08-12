"use server";

import { FormState } from "@/types";
import getNumber from "@/utils/getNumber";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateYear(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const yearId = getNumber(formData, "year-id");
  const currentSemester = getNumber(formData, "current-semester");
  const data = {
    currentSemester,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/years/${yearId}`,
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
    revalidatePath("/", "page");
    revalidatePath("/update", "page");
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}
