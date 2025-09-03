import { DatabaseTable, Module } from "@/types";
import { cookies } from "next/headers";

export default async function getModules(yearId: number): Promise<Module[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/years/${yearId}/modules?sort=createdAt`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.modules;
}
