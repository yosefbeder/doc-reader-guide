import Image from "next/image";
import Link from "next/link";

import Logo from "@/public/logo.png";
import { icons } from "./icons";

export default function Nav({ title, name }: { title: string; name: string }) {
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
        {icons["user-circle"]} <span>{name}</span>
      </Link>
    </nav>
  );
}
