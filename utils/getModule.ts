import { Module } from "@/types";

export default async function getModule(moduleId: number): Promise<Module> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/modules/${moduleId}`
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
