import { NextRequest, NextResponse } from "next/server";

import getUser from "./utils/getUser";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  let jwt = req.cookies.get("jwt")?.value;
  const toLogin = pathname.startsWith("/login");
  const toSignup = pathname.startsWith("/signup");

  if (jwt) {
    try {
      const user = await getUser(jwt);
      const isAdmin = user.role === "Admin";
      const homePage = `/years/${user.yearId}`;
      if (
        pathname === "/" ||
        (pathname.startsWith("/years") && !pathname.startsWith(homePage)) ||
        toSignup ||
        toLogin ||
        (!isAdmin && pathname.endsWith("/update"))
      )
        return NextResponse.redirect(new URL(homePage, req.url));
    } catch (err) {
      console.error(err);
      jwt = undefined;
    }
  }

  if (!jwt && !toLogin && !toSignup)
    return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
