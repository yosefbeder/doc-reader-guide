import { cookies } from "next/headers";

import { API_URL } from "@/constants";
import { Lecture, Link } from "@/types";

export default async function getFinalRevision(
  subjectId: number
): Promise<Lecture> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/final-revision/${subjectId}`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error();
  return json.data;
}

export async function getFinalRevisionLinks(
  subjectId: number
): Promise<Link[]> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/final-revision/${subjectId}/links`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error();
  return json.data;
}
