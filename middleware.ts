import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;
  const jwt = req.cookies.get("jwt")?.value;

  const isAppRoute = pathname.startsWith("/app");
  const isLandingPage = pathname === "/";
  const isLoginPage = pathname.startsWith("/login");

  // Define protected routes
  const toDashboard =
    pathname.endsWith("/update") || pathname.startsWith("/users");
  const toProfile = pathname.startsWith("/profile");

  if (jwt) {
    // User is AUTHENTICATED
    try {
      const decodedToken = decodeJwt(jwt);
      const isAdmin = decodedToken.role !== 3;

      // If user is on login or landing page, redirect to the app's home
      if (isLoginPage || isLandingPage) {
        return NextResponse.redirect(new URL("/app", req.url));
      }

      // If a non-admin tries to access admin-only routes, redirect to app home
      if (!isAdmin && toDashboard) {
        return NextResponse.redirect(new URL("/app", req.url));
      }
    } catch (err) {
      console.error("JWT decoding failed:", err);
      // If token is invalid, it's corrupt. Treat as unauthenticated.
      // Redirect to login and delete the invalid cookie to prevent loops.
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("jwt");
      return response;
    }
  } else {
    // User is NOT AUTHENTICATED
    const isProtectedRoute = isAppRoute || toProfile || toDashboard;

    const response = isProtectedRoute
      ? NextResponse.redirect(new URL("/login", req.url))
      : NextResponse.next();

    // Set guest cookie for all unauthenticated users
    response.cookies.set({
      name: "guest",
      value: "true",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  }

  // Allow all other valid requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.well-known|images|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};