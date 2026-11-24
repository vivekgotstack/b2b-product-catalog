import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signIn } from "@/app/auth-actions";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authConfiguration, catalogueReturnPath, hasValidSession, rememberedSessionDays, sessionCookieName } from "@/lib/auth";

type Props = { searchParams: Promise<{ next?: string | string[]; error?: string | string[] }> };

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: Props) {
  const query = await searchParams;
  const next = catalogueReturnPath(query.next);
  if (hasValidSession((await cookies()).get(sessionCookieName)?.value)) redirect(next);

  const configured = Boolean(authConfiguration());
  const invalid = query.error === "credentials" && configured;

  return (
    <div className="sign-in-card">
      <h1>Sign in</h1>
      <p className="sign-in-description">Enter the email and password shared with you to open the catalogue.</p>
      {(!configured || invalid) && (
        <p className="sign-in-error" role="alert">
          {invalid ? "That email or password is incorrect. Please try again." : "Sign-in is temporarily unavailable. Contact the person who gave you access."}
        </p>
      )}
      <form action={signIn}>
        <input type="hidden" name="next" value={next} />
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
