"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { FormState } from "@/types";

export async function login(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const res = await fetch(`${process.env.API_URL}/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(loginData),
  });

  const json = await res.json();

  if (res.ok) {
    cookies().set("jwt", json.data.token);
    redirect("/");
  } else {
    return { errorMessage: json.message };
  }
}

export async function signup(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const signupData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    facultyId: Number.parseInt(formData.get("faculty") as string),
    yearId: Number.parseInt(formData.get("year") as string),
  };

  const res = await fetch(`${process.env.API_URL}/register`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(signupData),
  });

  const json = await res.json();

  if (res.ok) {
    cookies().set("jwt", json.data.token);
    redirect("/");
  } else {
    return { errorMessage: json.message };
  }
}
