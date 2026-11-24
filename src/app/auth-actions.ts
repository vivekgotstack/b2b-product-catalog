"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authConfiguration, credentialsMatch, expiredSessionCookie, sessionCookie } from "@/lib/auth";

export async function signIn(form: FormData) {
  const auth = authConfiguration();

  if (!auth) redirect("/login/");

  const email = form.get("email");
  const password = form.get("password");
  if (typeof email !== "string" || typeof password !== "string" || !credentialsMatch(email, password, auth)) {
    redirect("/login/?error=credentials");
  }

  (await cookies()).set(sessionCookie(form.get("remember") === "on", auth));
  redirect("/admin/");
}

export async function signOut() {
  (await cookies()).set(expiredSessionCookie());
  redirect("/login/");
}
