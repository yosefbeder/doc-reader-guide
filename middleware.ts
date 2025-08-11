import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

const secret = new TextEncoder().encode(process.env.SECRET!);

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  let jwt = req.cookies.get("jwt")?.value;
  const toLogin = pathname.startsWith("/login");
  const toDashboard = pathname.endsWith("/update");

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

  if (!jwt && !toLogin)
    return NextResponse.redirect(
      new URL(
        `/login?redirect=${encodeURIComponent(
          req.nextUrl.pathname + req.nextUrl.search
        )}`,
        req.url
      )
    );

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.well-known|images|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
