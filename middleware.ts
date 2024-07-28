import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;
  const jwt = req.cookies.get("jwt")?.value;
  const toLogin = pathname.startsWith("/login");
  const toSignup = pathname.startsWith("/signup");

  if (jwt && (toLogin || toSignup))
    return NextResponse.redirect(new URL("/", req.url));

  if (!jwt && !toLogin && !toSignup)
    return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
