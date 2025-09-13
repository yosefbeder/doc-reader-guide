"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { FormState, Link } from "@/types";
import getNumber from "@/utils/getNumber";
import parseUrls from "@/utils/parseUrls";
import { sendAutoNotification } from "@/utils/sendAutoNotification";

export async function addLink(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const lectureId = formData.get("lecture-id");
  const data = {
    title: formData.get("title"),
    subTitle: formData.get("sub-title") || undefined,
    urls: parseUrls(formData),
    type: formData.get("type"),
    category: formData.get("category"),
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}/links`,
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
    const link = json.data.link as Link;
    revalidatePath(`/lectures/${lectureId}`);
    revalidatePath(`/lectures/${lectureId}/update`);
    if (formData.get("notify"))
      sendAutoNotification(getNumber(formData, "year-id"), "link", link.id);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function updateLink(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const linkId = getNumber(formData, "link-id");
  const lectureId = getNumber(formData, "lecture-id");
  const data = {
    title: formData.get("title"),
    subTitle: formData.get("sub-title") || "",
    urls: parseUrls(formData),
    type: formData.get("type"),
    category: formData.get("category"),
    lectureId,
  };

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/links/${linkId}`,
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
    if (formData.get("notify"))
      sendAutoNotification(getNumber(formData, "year-id"), "link", linkId);
  }

  return {
    type: res.ok ? "success" : "fail",
    message: json.message,
    resetKey: Date.now(),
  };
}

export async function deleteLink(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const linkId = formData.get("link-id");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/links/${linkId}`,
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

  revalidatePath(`/lectures/${json.data.link.lectureId}`);
  revalidatePath(`/lectures/${json.data.link.lectureId}/update`);

  return {};
}
