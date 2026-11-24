import { NextResponse, type NextRequest } from "next/server";
import { hasValidSession, sessionCookieName } from "@/lib/auth";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  const publicPage = pathname === "/login" || pathname === "/login/help";

  if (publicPage || hasValidSession(request.cookies.get(sessionCookieName)?.value)) {
    const response = NextResponse.next();
    for (const [name, value] of Object.entries(privateHeaders)) response.headers.set(name, value);
    return response;
  }

  return NextResponse.redirect(new URL("/login/", request.url), {
    status: 303,
    headers: privateHeaders,
  });
}

export const config = {
  matcher: ["/admin/:path*", "/login/:path*"],
};
