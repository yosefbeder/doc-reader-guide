import { cookies } from "next/headers";

import { API_URL } from "@/constants";
import { PracticalLink } from "@/types";

export default async function getPracticalLink(
  linkId: number
): Promise<PracticalLink> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/practical/links/${linkId}`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error();
  return json.data;
}
