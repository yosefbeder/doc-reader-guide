"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function pathnameToTitle(pathname: string): string {
  if (pathname === "/" || pathname.startsWith("/dashboard/modules"))
    return "الموديولات";
  else if (pathname === "/profile") return "البيانات الشخصية";
  else if (pathname === "/dashboard") return "لوحة التحكم";
  else if (
    pathname.match(
      /\/modules\/\d+\/subjects\/\d+\/(lectures\/\d+|practical|final-revision)/g
    )
  )
    return "المصادر";
  else if (pathname.match(/\/modules\/\d+\/subjects\/\d+/g)) return "المحاضرات";
  else if (pathname.startsWith("/modules")) return "المواد";
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
