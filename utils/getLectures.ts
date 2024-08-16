import { cookies } from "next/headers";

import { Lecture } from "@/types";
import { API_URL } from "@/constants";

export async function getLectures(subjectId: number): Promise<Lecture[]> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/subjects/${subjectId}/lectures`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();

  return json.data;
}
