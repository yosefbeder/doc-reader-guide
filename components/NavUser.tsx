"use client";

import useSWR from "swr";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";

import Search from "./Search";
import NavLink from "./NavLink";
import getUser from "@/utils/getUser";
import { icons } from "./icons";
import Notifications from "./Notifications";

export default function NavUser({ updateable }: { updateable?: boolean }) {
  const {
    data: user,
    isLoading,
    error,
  } = useSWR("user", async () => await getUser(Cookies.get("jwt")!));
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      <Search yearId={user?.yearId || -1} />
      <NavLink href="/profile">
        {icons["user-circle"]}{" "}
        {isLoading ? "Loading..." : error ? "Error" : user?.name}
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
        </>
      )}
    </div>
  );
}
