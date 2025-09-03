"use client";

import useSWR from "swr";
import { usePathname, useRouter } from "next/navigation";
import NextLink from "next/link";

import Search from "./Search";
import NavLink from "./NavLink";
import getUser from "@/utils/getUserClient";
import { icons } from "./icons";
import Notifications from "./Notifications";
import { useLogout } from "@/lib/hooks";

export default function NavUser({ updateable }: { updateable?: boolean }) {
  const {
    data: user,
    isLoading,
    error,
  } = useSWR("user", async () => await getUser());
  const router = useRouter();
  const pathname = usePathname();
  const logout = useLogout();

  if (error?.status === 401) logout();

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
      ) : error ? (
        "Error"
      ) : (
        <NextLink
          className="link"
          href={`/login?redirect=${encodeURIComponent(pathname)}`}
        >
          Login
        </NextLink>
      )}
      {!isLoading && user && user.roleId !== 3 && (
        <>
          {updateable && (
            <button
              className={`radio p-2 ${
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
            <NavLink href="/users" className="p-2">
              {icons["user-group"]}
            </NavLink>
          )}
        </>
      )}
    </div>
  );
}
