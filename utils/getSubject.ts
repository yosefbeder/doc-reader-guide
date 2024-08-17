import { cookies } from "next/headers";

import { API_URL } from "@/constants";
import { Subject } from "@/types";

export default async function getSubject(subjectId: number): Promise<Subject> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/subjects/${subjectId}`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error();
  return json.data;
}
