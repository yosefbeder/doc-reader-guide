import { decode } from "jsonwebtoken";
import { User } from "./types";
import { cookies } from "next/headers";

export async function getUser(): Promise<User> {
  const jwt = cookies().get("jwt")!.value;
  const res = await fetch(`${process.env.API_URL}/user`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error();
  const user = json.data;
  delete user.faculty;
  delete user.year;
  return user;
}
