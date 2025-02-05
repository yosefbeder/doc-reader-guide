import { Faculty } from "@/types";

export default async function getFaculties(): Promise<Faculty[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/faculties`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
