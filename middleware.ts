import { NextRequest, NextResponse } from "next/server";
import getUser from "./utils/getUser";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const jwt = req.cookies.get("jwt")?.value;
  const toLogin = pathname.startsWith("/login");
  const toSignup = pathname.startsWith("/signup");
  const toDashboard = pathname.startsWith("/dashboard");

  if (jwt) {
    const user = await getUser();
    const isAdmin = user.role === "Admin";
    if (toLogin || toSignup || (!isAdmin && toDashboard))
      return NextResponse.redirect(new URL("/", req.url));
  }

  if (!jwt && !toLogin && !toSignup)
    return NextResponse.redirect(new URL("/login", req.url));

  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: reqHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
