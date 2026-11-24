import { NextResponse, type NextRequest } from "next/server";
import { catalogueReturnPath, hasValidSession, loginPath, sessionCookieName } from "@/lib/auth";

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

  if (pathname.startsWith("/images/") || pathname.startsWith("/_next/") || pathname === "/sitemap.xml") {
    return new NextResponse(null, { status: 401, headers: privateHeaders });
  }

  const next = catalogueReturnPath(request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(new URL(loginPath(next), request.url), {
    status: 303,
    headers: privateHeaders,
  });
}

export const config = {
  matcher: ["/((?!_next/static/|robots\\.txt$|icon\\.svg$|favicon\\.ico$).*)"],
};
