import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "min-h-12 w-full rounded-md border border-border bg-background px-3 text-base text-foreground placeholder:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
