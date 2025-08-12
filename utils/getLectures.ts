import { Lecture } from "@/types";
import { cookies } from "next/headers";

export default async function getLectures(
  subjectId: number
): Promise<Lecture[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/subjects/${subjectId}/lectures?sort=date,createdAt`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          cookies().get("jwt")?.value || process.env.JWT
        }`,
      },
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.lectures;
}
