import { Subject } from "@/types";

export default async function getSubjects(
  moduleId: number
): Promise<Subject[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/modules/${moduleId}/subjects`
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
