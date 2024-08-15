import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";

import Logo from "@/public/logo.png";
import { icons } from "./icons";
import NavLink from "./NavLink";
import getUser from "@/utils/getUser";
import NavTitle from "./NavTitle";

export default async function Nav() {
  const user = await getUser();
  const initPathname = headers().get("x-pathname")!;

  return (
    <nav className="main flex items-center text-slate-900">
      <Link
        href="/"
        className="flex items-center gap-2 no-underline text-inherit hover:text-inherit ml-auto"
      >
        <Image src={Logo} className="w-8" alt="Logo" />
        <span className="text-xl font-bold text-cyan-700">دوكريدر جايد</span>
      </Link>
      <NavTitle className="ml-auto" initPathname={initPathname} />
      <NavLink href="/profile">
        {icons["user-circle"]} <span>{user.name}</span>
      </NavLink>
      {user.role === "Admin" && (
        <NavLink href="/dashboard" className="mr-2">
          {icons["squares-2x2"]} <span>لوحة التحكم</span>
        </NavLink>
      )}
    </nav>
  );
}
