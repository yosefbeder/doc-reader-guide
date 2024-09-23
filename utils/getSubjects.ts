import { Subject } from "@/types";
import { API_URL } from "@/constants";

export default async function getSubjects(
  moduleId: number
): Promise<Subject[]> {
  const res = await fetch(`${API_URL}/modules/${moduleId}/subjects`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
