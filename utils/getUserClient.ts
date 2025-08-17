import { User } from "@/types";
import Cookies from "js-cookie";

export default async function getUser(): Promise<User | undefined> {
  if (Cookies.get("guest")) return;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/me?include=year`,
    {
      credentials: "include",
    }
  );
  const json = await res.json();
  if (!res.ok) throw { status: res.status, message: json.message };
  return json.data.user;
}
