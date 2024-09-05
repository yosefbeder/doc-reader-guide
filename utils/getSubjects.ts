import { cookies } from "next/headers";

import { Subject } from "@/types";
import { API_URL } from "@/constants";

export default async function getSubjects(
  yearId: number,
  moduleId: number
): Promise<Subject[]> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/modules/${yearId}/${moduleId}/subjects`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
