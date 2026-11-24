import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

export function proxy(request: NextRequest) {
  const email = process.env.CATALOGUE_LOGIN_EMAIL?.trim();
  const password = process.env.CATALOGUE_PASSWORD;

  if (!email || !password) {
    if (!email && !password && process.env.NODE_ENV === "development" && !process.env.VERCEL) {
      return NextResponse.next();
    }

    return new NextResponse("Catalogue access is not configured.", {
      status: 503,
      headers: privateHeaders,
    });
  }

  const token = request.headers.get("authorization")?.match(/^Basic ([A-Za-z0-9+/]+=*)$/i)?.[1];
  if (token) {
    const given = createHash("sha256").update(Buffer.from(token, "base64")).digest();
    const expected = createHash("sha256").update(`${email}:${password}`, "utf8").digest();

    if (timingSafeEqual(given, expected)) {
      const response = NextResponse.next();
      for (const [name, value] of Object.entries(privateHeaders)) {
        response.headers.set(name, value);
      }
      return response;
    }
  }

  return new NextResponse("Sign in to view the catalogue.", {
    status: 401,
    headers: {
      ...privateHeaders,
      "WWW-Authenticate": 'Basic realm="Apparel Catalogue", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static/|robots\\.txt$).*)"],
};
