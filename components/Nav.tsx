"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import Cookies from "js-cookie";

import Logo from "@/public/logo.png";
import { icons } from "./icons";
import { API_URL } from "@/constants";

const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      authorization: `Bearer ${Cookies.get("jwt")!}`,
    },
  })
    .then((res) => res.json())
    .then((json) => json.data);

export default function Nav() {
  const { data, isLoading, error } = useSWR(`${API_URL}/user`, fetcher);
  const pathname = usePathname();
  let title = "";

  if (pathname === "/") title = "الموديولات";
  else if (pathname === "/profile") title = "البيانات الشخصية";
  else if (pathname.startsWith("/modules")) title = "المواد";

  if (error) throw new Error();

  return (
    <nav className="max-w-screen-md mx-auto px-2 py-4 flex justify-between items-center text-slate-900">
      <Link
        href="/"
        className="flex items-center gap-2 no-underline text-inherit hover:text-inherit"
      >
        <Image src={Logo} className="w-12" alt="Logo" />
        <span className="text-xl font-bold">دوكريدر جايد</span>
      </Link>
      <h1>{title}</h1>
      <Link
        href="/profile"
        className="p-2 rounded-md border-slate-700 flex items-center gap-2 no-underline text-inherit hover:text-inherit active:text-inherit hover:bg-slate-50 active:bg-slate-100  transition-colors"
      >
        {icons["user-circle"]}{" "}
        <span>{isLoading ? "تحميل..." : data!.name}</span>
      </Link>
    </nav>
  );
}
