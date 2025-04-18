import { Link } from "@/types";

export default async function getAllLinks(yearId: number): Promise<Link[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/years/${yearId}/links`
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  return json.data;
}
