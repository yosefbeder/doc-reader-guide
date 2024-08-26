import { API_URL } from "@/constants";
import { Faculty } from "@/types";

export default async function getFaculties(): Promise<Faculty[]> {
  const res = await fetch(`${API_URL}/faculties`);
  if (!res.ok) throw new Error();
  const json = await res.json();
  return json.data;
}
