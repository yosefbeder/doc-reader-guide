import { Subject } from "@/types";
import { cookies } from "next/headers";

export default async function getSubjects(
  moduleId: number
): Promise<Subject[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/modules/${moduleId}/subjects`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies().get("jwt")!.value}`,
      },
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.subjects;
}
