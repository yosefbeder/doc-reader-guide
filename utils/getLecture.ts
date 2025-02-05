import { Lecture, Link, Quiz } from "@/types";

export default async function getLecture(lectureId: number): Promise<Lecture> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}`
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}

export async function getLectureLinksAndQuizzes(
  lectureId: number
): Promise<{ links: Link[]; quizzes: Quiz[] }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/lectures/${lectureId}/links`
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
