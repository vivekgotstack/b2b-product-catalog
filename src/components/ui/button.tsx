import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline: "border border-border bg-background text-foreground hover:border-primary hover:text-primary",
        ghost: "text-foreground hover:bg-muted",
        inverse: "border border-white/30 bg-white/10 text-white hover:bg-white/20",
        whatsapp: "bg-[#14653d] text-white hover:bg-[#0e4e2e]",
      },
      size: {
        default: "min-h-11 px-4",
        sm: "min-h-10 px-3.5",
        lg: "min-h-12 px-5",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export function Button({
  asChild = false,
  className,
  variant,
  size,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
