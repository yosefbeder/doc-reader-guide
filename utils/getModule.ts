import { Module } from "@/types";
import { cookies } from "next/headers";

export default async function getModule(moduleId: number): Promise<Module> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/modules/${moduleId}?include=year.faculty`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          cookies().get("jwt")?.value || process.env.NEXT_PUBLIC_JWT
        }`,
      },
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.module;
}
