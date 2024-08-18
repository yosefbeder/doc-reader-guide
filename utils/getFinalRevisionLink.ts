import { cookies } from "next/headers";

import { API_URL } from "@/constants";
import { Link } from "@/types";

export default async function getFinalRevisionLink(
  linkId: number
): Promise<Link> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${API_URL}/final-revision/links/${linkId}`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error();
  return json.data;
}
