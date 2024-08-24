import { cookies } from "next/headers";

import { API_URL } from "@/constants";
import { Lecture } from "@/types";

export default async function getAllLectures(
  yearId: number
): Promise<Lecture[]> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/years/${yearId}/lectures`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error();
  return json.data;
}
