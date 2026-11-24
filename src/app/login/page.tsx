import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signIn } from "@/app/auth-actions";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authConfiguration, hasValidSession, rememberedSessionDays, sessionCookieName } from "@/lib/auth";

type Props = { searchParams: Promise<{ error?: string | string[] }> };

export const metadata: Metadata = { title: "Staff sign-in" };

export default async function LoginPage({ searchParams }: Props) {
  const query = await searchParams;
  if (hasValidSession((await cookies()).get(sessionCookieName)?.value)) redirect("/admin/");

  const configured = Boolean(authConfiguration());
  const invalid = query.error === "credentials" && configured;

  return (
    <div className="sign-in-card">
      <h1>Sign in</h1>
      <p className="sign-in-description">Enter your staff email and password to manage the catalogue.</p>
      {(!configured || invalid) && (
        <p className="sign-in-error" role="alert">
          {invalid ? "That email or password is incorrect. Please try again." : "Sign-in is temporarily unavailable. Contact the person who gave you access."}
        </p>
      )}
      <form action={signIn}>
        <fieldset disabled={!configured} className="sign-in-fields">
          <div className="sign-in-field">
            <label htmlFor="login-email">Email address</label>
            <Input id="login-email" name="email" type="email" autoComplete="username" autoCapitalize="none" required aria-invalid={invalid || undefined} />
          </div>
          <div className="sign-in-field">
            <label htmlFor="login-password">Password</label>
            <PasswordInput invalid={invalid} />
          </div>
          <label className="remember-device">
            <input type="checkbox" name="remember" aria-describedby="remember-hint" />
            <span>
              <strong>Remember me on this device</strong>
              <small id="remember-hint">Stay signed in for {rememberedSessionDays} days on this device.</small>
            </span>
          </label>
          <Button type="submit" size="lg" className="w-full">Sign in</Button>
        </fieldset>
      </form>
      <a className="sign-in-help" href="/login/help/">Forgot your password?</a>
    </div>
  );
}
