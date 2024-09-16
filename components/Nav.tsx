import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";

import Logo from "@/public/logo.png";
import { icons } from "./icons";
import NavLink from "./NavLink";
import getUser from "@/utils/getUser";
import NavTitle from "./NavTitle";
import Search from "./Search";
import Notifications from "./Notifications";

export default async function Nav() {
  const user = await getUser();
  const initPathname = headers().get("x-pathname")!;

  return (
    <>
      <nav
        className={`main flex items-center text-slate-900 ${
          user.role === "Admin" && "max-sm:flex-col max-sm:gap-4"
        }`}
      >
        <Link
          href="/"
          className={`flex items-center gap-2 no-underline text-inherit hover:text-inherit ml-auto ${
            user.role === "Admin" && "max-sm:m-0"
          }`}
        >
          <Image src={Logo} className="w-8" alt="Logo" />
          <span className="text-xl font-bold text-cyan-700">دوكريدر جايد</span>
        </Link>
        <NavTitle
          className="ml-auto max-md:hidden"
          initPathname={initPathname}
        />
        <div className="flex items-center">
          {<Search yearId={user.yearId} />}
          <NavLink href="/profile">
            {icons["user-circle"]} <span>{user.name}</span>
          </NavLink>
          {user.role === "Admin" && (
            <>
              <NavLink href="/dashboard" className="mx-2">
                {icons["squares-2x2"]}
              </NavLink>
              <Notifications yearId={user.yearId} />
            </>
          )}
        </div>
      </nav>
      <NavTitle
        className="hidden bg-cyan-50 py-4 text-center max-md:block"
        initPathname={initPathname}
      />
    </>
  );
}
