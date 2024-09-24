import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SECRET!);

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  let jwt = req.cookies.get("jwt")?.value;
  const toLogin = pathname.startsWith("/login");
  const toSignup = pathname.startsWith("/signup");
  const toDashboard = pathname.startsWith("/dashboard");

  if (jwt) {
    try {
      const isAdmin = (await jwtVerify(jwt, secret)).payload.role === "Admin";
      if (toLogin || toSignup || (!isAdmin && toDashboard))
        return NextResponse.redirect(new URL("/", req.url));
    } catch (err) {
      console.error(err);
      jwt = undefined;
    }
  }

  if (!jwt && !toLogin && !toSignup)
    return NextResponse.redirect(new URL("/login", req.url));

  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-pathname", req.nextUrl.pathname);
  return NextResponse.next({ request: { headers: reqHeaders } });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
