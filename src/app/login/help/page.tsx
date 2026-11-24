import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Sign-in help" };

export default function SignInHelpPage() {
  return (
    <div className="sign-in-card">
      <h1>Sign-in help</h1>
      <p className="sign-in-description">If you’ve forgotten your password, ask the person who shared catalogue access for the current sign-in details.</p>
      <Button asChild className="sign-in-return"><a href="/login/">Back to sign in</a></Button>
    </div>
  );
}
