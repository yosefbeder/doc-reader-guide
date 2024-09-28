"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

import Logo from "@/public/logo.png";
import { icons } from "./icons";
import getUser from "@/utils/getUser";
import Search from "./Search";
import Notifications from "./Notifications";
import NavLink from "./NavLink";

export default function Nav({
  title,
  updateable,
}: {
  title: string;
  updateable?: boolean;
}) {
  const {
    data: user,
    isLoading,
    error,
  } = useSWR("user", async () => await getUser(Cookies.get("jwt")!));
  const router = useRouter();
  const pathname = usePathname();

  if (error) throw new Error("Fetching user failed");

  return (
    <>
      <nav className="main flex items-center justify-between max-sm:flex-col max-sm:gap-4 text-slate-900">
        <Link
          href={user ? `/years/${user.yearId}` : "/"}
          className="flex items-center gap-2 no-underline text-inherit hover:text-inherit"
        >
          <Image src={Logo} className="w-8" alt="Logo" />
          <span className="text-xl font-bold text-cyan-700">دوكريدر جايد</span>
        </Link>
        <h1 className="max-md:hidden">{title}</h1>
        <div className="flex items-center gap-2">
          <Search yearId={user?.yearId || -1} />
          <NavLink href="/profile">
            {icons["user-circle"]} {isLoading || !user ? "تحميل..." : user.name}
          </NavLink>
          {!isLoading && user && user.role === "Admin" && (
            <>
              {updateable && (
                <button
                  className={`nav-link ${
                    pathname.endsWith("/update") ? "selected" : "normal"
                  }`}
                  onClick={() => {
                    if (pathname.endsWith("/update")) {
                      router.replace(
                        pathname.slice(0, pathname.indexOf("/update"))
                      );
                    } else {
                      router.replace(`${pathname}/update`);
                    }
                  }}
                >
                  {icons["pencil-square"]}
                </button>
              )}
              <Notifications yearId={user.yearId} />
            </>
          )}
        </div>
      </nav>
      <h1 className="hidden bg-cyan-50 py-4 text-center max-md:block">
        {title}
      </h1>
    </>
  );
}
