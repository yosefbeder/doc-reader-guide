import Nav from "@/components/Nav";
import { getUser } from "@/utils";

export default async function HomePage() {
  const { name } = await getUser();
  return <Nav title="الموديولات" name={name} />;
}
