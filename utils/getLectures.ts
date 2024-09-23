import { Lecture } from "@/types";
import { API_URL } from "@/constants";

export default async function getLectures(
  subjectId: number
): Promise<Lecture[]> {
  const res = await fetch(`${API_URL}/subjects/${subjectId}/lectures`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
