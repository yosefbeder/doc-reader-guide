import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  let jwt = req.cookies.get("jwt")?.value;
  const toLogin = pathname.startsWith("/login");
  const toDashboard = pathname.endsWith("/update");
  const toHome = pathname === "/";
  const toProfile = pathname.startsWith("/profile");

  if (jwt) {
    try {
      const isAdmin = decodeJwt(jwt).role !== 3;
      if (toLogin || (!isAdmin && toDashboard))
        return NextResponse.redirect(new URL("/", req.url));
    } catch (err) {
      console.error(err);
      jwt = undefined;
    }
  }

  if (!jwt) {
    // Prepare response based on redirect condition
    const res =
      toHome || toProfile || toDashboard
        ? NextResponse.redirect(new URL("/login", req.url))
        : NextResponse.next();

    // Set cookie on the response (req.cookies is read-only)
    res.cookies.set({
      name: "guest",
      value: "true",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.well-known|images|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
