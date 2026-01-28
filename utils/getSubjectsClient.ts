import { Subject } from "@/types";

export default async function getSubjects(
  moduleId: number
): Promise<Subject[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/modules/${moduleId}/subjects?sort=createdAt`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data.subjects as Subject[];
  // .toSorted(
  //   (a, b) => b._count.lectures - a._count.lectures
  // );
}
