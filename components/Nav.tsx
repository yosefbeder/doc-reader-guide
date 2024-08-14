"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import Cookies from "js-cookie";

import Logo from "@/public/logo.png";
import { icons } from "./icons";
import { API_URL } from "@/constants";
import { User } from "@/types";
import NavLink from "./NavLink";

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      authorization: `Bearer ${Cookies.get("jwt")!}`,
    },
  })
    .then((res) => res.json())
    .then((json) => json.data as User);

export default function Nav() {
  const { data, isLoading, error } = useSWR(`${API_URL}/user`, fetcher);
  const pathname = usePathname();
  let title = "";

  if (pathname === "/") title = "الموديولات";
  else if (pathname === "/profile") title = "البيانات الشخصية";
  else if (pathname === "/dashboard") title = "لوحة التحكم";
  else if (
    pathname.match(
      /\/modules\/\d+\/subjects\/\d+\/(lectures\/\d+|practical|final-revision)/g
    )
  )
    title = "المصادر";
  else if (pathname.match(/\/modules\/\d+\/subjects\/\d+/g))
    title = "المحاضرات";
  else if (pathname.startsWith("/modules")) title = "المواد";

  if (error) throw new Error();

  return (
    <nav className="max-w-screen-md mx-auto px-2 py-4 flex items-center text-slate-900">
      <Link
        href="/"
        className="flex items-center gap-2 no-underline text-inherit hover:text-inherit ml-auto"
      >
        <Image src={Logo} className="w-12" alt="Logo" />
        <span className="text-xl font-bold">دوكريدر جايد</span>
      </Link>
      <h1 className="ml-auto">{title}</h1>
      <NavLink href="/profile" selected={pathname === "/profile" && !isLoading}>
        {icons["user-circle"]}{" "}
        <span>{isLoading ? "تحميل..." : data!.name}</span>
      </NavLink>
      {!isLoading && data!.role === "Admin" && (
        <NavLink
          href="/dashboard"
          className="mr-2"
          selected={pathname === "/dashboard" && !isLoading}
        >
          {icons["squares-2x2"]} <span>لوحة التحكم</span>
        </NavLink>
      )}
    </nav>
  );
}
