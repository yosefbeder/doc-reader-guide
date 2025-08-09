import { Module } from "@/types";

export default async function getModules(yearId: number): Promise<Module[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/years/${yearId}/modules`,
    { credentials: "include" }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.modules;
}
