import { cookies } from "next/headers";

import { Module } from "@/types";
import { API_URL } from "@/constants";

export default async function getModules(yearId: number): Promise<Module[]> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/modules/${yearId}`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
