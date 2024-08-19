import { cookies } from "next/headers";

import { API_URL } from "@/constants";
import { Lecture, PracticalLink } from "@/types";

export default async function getPractical(
  subjectId: number
): Promise<Lecture> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/practical/${subjectId}`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error();
  return json.data;
}

export async function getPracticalLinks(
  subjectId: number
): Promise<PracticalLink[]> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/practical/${subjectId}/links`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error();
  return json.data;
}
