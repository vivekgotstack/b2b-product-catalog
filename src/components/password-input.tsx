"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function PasswordInput({ invalid }: { invalid: boolean }) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="password-input">
      <Input id="login-password" name="password" type={visible ? "text" : "password"} autoComplete="current-password" required aria-invalid={invalid || undefined} className="pr-14" />
      <button type="button" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible((current) => !current)}>
        <Icon size={19} aria-hidden="true" />
      </button>
    </div>
  );
}
