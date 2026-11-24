import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const sessionCookieName = "bulkout_admin_session";
export const rememberedSessionDays = 30;

const rememberedSeconds = rememberedSessionDays * 24 * 60 * 60;
const browserSessionSeconds = 12 * 60 * 60;

type AuthConfiguration = {
  email: string;
  password: string;
  secret: string;
};

export function authConfiguration(): AuthConfiguration | null {
  const email = process.env.CATALOGUE_LOGIN_EMAIL?.trim().toLowerCase();
  const password = process.env.CATALOGUE_PASSWORD;
  const secret = process.env.CATALOGUE_SESSION_SECRET;

  return email && password && secret && Buffer.byteLength(secret) >= 32
    ? { email, password, secret }
    : null;
}

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

export function credentialsMatch(email: string, password: string, config: AuthConfiguration) {
  const emailMatches = timingSafeEqual(digest(email.trim().toLowerCase()), digest(config.email));
  const passwordMatches = timingSafeEqual(digest(password), digest(config.password));
  return emailMatches && passwordMatches;
}

function signature(payload: string, config: AuthConfiguration) {
  return createHmac("sha256", config.secret)
    .update(JSON.stringify(["bulkout-admin-v1", config.email, config.password, payload]))
    .digest("base64url");
}

const cookieOptions = {
  name: sessionCookieName,
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
} as const;

export function sessionCookie(remember: boolean, config: AuthConfiguration) {
  const lifetime = remember ? rememberedSeconds : browserSessionSeconds;
  const expires = Math.floor(Date.now() / 1000) + lifetime;
  const payload = `${expires}.${randomBytes(12).toString("base64url")}`;

  return {
    ...cookieOptions,
    value: `${payload}.${signature(payload, config)}`,
    ...(remember && { maxAge: lifetime }),
  };
}

export function expiredSessionCookie() {
  return { ...cookieOptions, value: "", maxAge: 0 };
}

export function hasValidSession(token: string | undefined) {
  const config = authConfiguration();
  const parts = token?.match(/^(\d{1,12}\.[A-Za-z0-9_-]{16})\.([A-Za-z0-9_-]{43})$/);
  if (!config || !parts) return false;

  const [, payload, providedSignature] = parts;
  const expires = Number(payload.split(".")[0]);
  const now = Math.floor(Date.now() / 1000);

  return expires > now && expires <= now + rememberedSeconds
    && timingSafeEqual(Buffer.from(providedSignature), Buffer.from(signature(payload, config)));
}

