"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function pathnameToTitle(pathname: string): string {
  if (pathname === "/" || pathname.startsWith("/dashboard/modules"))
    return "الموديولات";
  if (pathname === "/profile") return "البيانات الشخصية";
  if (pathname === "/dashboard") return "لوحة التحكم";
  if (
    pathname.startsWith("/modules") ||
    pathname.startsWith("/dashboard/subjects")
  )
    return "المواد";
  if (
    pathname.startsWith("/subjects") ||
    pathname.startsWith("/dashboard/lectures")
  )
    return "المحاضرات";
  if (
    pathname.match(/\/(lectures|practical|final-revision).*/g) ||
    pathname.startsWith("/dashboard/links")
  )
    return "المصادر";
  throw new Error();
}

interface NavTitleProps extends React.ComponentProps<"h1"> {
  initPathname: string;
}

export default function NavTitle({
  children: _children,
  initPathname,
  ...props
}: NavTitleProps) {
  const pathname = usePathname();
  const [title, setTitle] = useState<string>(pathnameToTitle(initPathname));

  useEffect(() => {
    setTitle(pathnameToTitle(pathname));
  }, [pathname]);

  return <h1 {...props}>{title}</h1>;
}
