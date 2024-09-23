import { API_URL } from "@/constants";
import { Lecture } from "@/types";

export default async function getAllLectures(
  yearId: number
): Promise<Lecture[]> {
  const res = await fetch(`${API_URL}/years/${yearId}/lectures`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
