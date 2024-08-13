import { cookies } from "next/headers";

import { API_URL } from "@/constants";
import { Module } from "@/types";

export default async function getModule(
  yearId: number,
  moduleId: number
): Promise<Module> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/modules/${yearId}/${moduleId}`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error();
  return json.data;
}
