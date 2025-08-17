"use client";

import useSWR from "swr";
import { usePathname, useRouter } from "next/navigation";
import NextLink from "next/link";
import Cookies from "js-cookie";

import Search from "./Search";
import NavLink from "./NavLink";
import getUser from "@/utils/getUserClient";
import { icons } from "./icons";
import Notifications from "./Notifications";

export default function NavUser({ updateable }: { updateable?: boolean }) {
  const {
    data: user,
    isLoading,
    error,
  } = useSWR("user", async () => await getUser());
  const router = useRouter();
  const pathname = usePathname();

  if (!user && Cookies.get("guest"))
    return (
      <NextLink
        className="link"
        href={`/login?redirect=${encodeURIComponent(pathname)}`}
      >
        Login
      </NextLink>
    );

  return (
    <div className="flex items-center gap-2">
      <Search yearId={user?.yearId || -1} />
      {user ? (
        <NavLink href="/profile" className="p-1 rounded-full">
          <img
            src={user.picture}
            alt="Picture"
            className="size-8 rounded-full"
          />
        </NavLink>
      ) : isLoading ? (
        "Loading..."
      ) : (
        "Error"
      )}
      {!isLoading && user && user.roleId !== 3 && (
        <>
          {updateable && (
            <button
              className={`nav-link ${
                pathname.endsWith("/update") ? "selected" : "normal"
              }`}
              onClick={() => {
                if (pathname.endsWith("/update")) {
                  router.push(
                    pathname.slice(0, pathname.indexOf("/update") + 1)
                  );
                } else {
                  router.push(`${pathname === "/" ? "" : pathname}/update`);
                }
              }}
            >
              {icons["pencil-square"]}
            </button>
          )}
          <Notifications yearId={user.yearId} />
          {user.roleId === 0 && (
            <NavLink href="/users">{icons["user-group"]}</NavLink>
          )}
        </>
      )}
    </div>
  );
}
