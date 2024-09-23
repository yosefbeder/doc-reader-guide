import { Module } from "@/types";
import { API_URL } from "@/constants";

export default async function getModules(yearId: number): Promise<Module[]> {
  const res = await fetch(`${API_URL}/years/${yearId}/modules`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
