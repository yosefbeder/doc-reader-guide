import { Subject } from "@/types";
import { cookies } from "next/headers";

export default async function getSubject(subjectId: number): Promise<Subject> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/subjects/${subjectId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.subject;
}
