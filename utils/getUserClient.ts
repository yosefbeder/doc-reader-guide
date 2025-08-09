import { User } from "@/types";

export default async function getUser(): Promise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    credentials: "include",
  });
  const json = await res.json();
  if (!res.ok) throw { status: res.status, message: json.message };
  return json.data.user;
}
