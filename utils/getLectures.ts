import { cookies } from "next/headers";

import { Lecture } from "@/types";
import { API_URL } from "@/constants";

export async function getLectures(subjectId: number): Promise<Lecture[]> {
  const jwt = cookies().get("jwt")!.value;
  const res1 = await fetch(`${API_URL}/subjects/${subjectId}/lectures`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json1 = await res1.json();
  const res2 = await fetch(`${API_URL}/subjects/${subjectId}/practical`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json2 = await res2.json();
  const res3 = await fetch(`${API_URL}/subjects/${subjectId}/final-revision`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json3 = await res3.json();

  return [json2.data, json3.data, ...json1.data];
}
