import { Lecture } from "@/types";

export default async function getAllLectures(
  yearId: number
): Promise<Lecture[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/years/${yearId}/lectures`
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
