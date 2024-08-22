import { cookies } from "next/headers";

import { API_URL } from "@/constants";
import { Lecture, Link } from "@/types";

export default async function getLecture(lectureId: number): Promise<Lecture> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/lectures/${lectureId}`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error();
  return json.data;
}

export async function getLectureLinks(lectureId: number): Promise<Link[]> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/lectures/${lectureId}/links`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error();
  return json.data;
}
