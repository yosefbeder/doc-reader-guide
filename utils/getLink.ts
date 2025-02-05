import { Link } from "@/types";

export default async function getLink(linkId: number): Promise<Link> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/links/${linkId}`);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
