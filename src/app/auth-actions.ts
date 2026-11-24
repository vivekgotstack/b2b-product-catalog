"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authConfiguration, catalogueReturnPath, credentialsMatch, expiredSessionCookie, loginPath, sessionCookie } from "@/lib/auth";

export async function signIn(form: FormData) {
  const next = catalogueReturnPath(form.get("next"));
  const auth = authConfiguration();

  if (!auth) redirect(loginPath(next, "unavailable"));

  const email = form.get("email");
  const password = form.get("password");
  if (typeof email !== "string" || typeof password !== "string" || !credentialsMatch(email, password, auth)) {
    redirect(loginPath(next, "credentials"));
  }

  (await cookies()).set(sessionCookie(form.get("remember") === "on", auth));
  redirect(next);
}

export async function signOut() {
  (await cookies()).set(expiredSessionCookie());
  redirect("/login/");
}
