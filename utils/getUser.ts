import { User } from "@/types";

export default async function getUser(jwt: string): Promise<User> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message);
  const user = json.data;
  delete user.faculty;
  delete user.year;
  return user;
}
