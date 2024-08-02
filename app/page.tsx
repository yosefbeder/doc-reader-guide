import { cookies } from "next/headers";

import Nav from "@/components/Nav";
import { getUser } from "@/utils";

export default async function HomePage() {
  const { name } = getUser(cookies().get("jwt")!.value);
  return <Nav title="الموديولات" name={name} />;
}
