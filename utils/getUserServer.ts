import { User } from "@/types";
import { cookies } from "next/headers";

export default async function getUser(): Promise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies().get("jwt")!.value}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw { status: res.status, message: json.message };
  return json.data.user;
}
