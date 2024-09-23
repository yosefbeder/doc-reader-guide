import { API_URL } from "@/constants";
import { Lecture, Link } from "@/types";

export default async function getLecture(lectureId: number): Promise<Lecture> {
  const res = await fetch(`${API_URL}/lectures/${lectureId}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}

export async function getLectureLinks(lectureId: number): Promise<Link[]> {
  const res = await fetch(`${API_URL}/lectures/${lectureId}/links`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
