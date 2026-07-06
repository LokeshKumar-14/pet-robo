import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md" | "lg" | "icon";
};

const variants: Record<Variant, string> = {
  primary: "bg-cyan text-ink shadow-glow hover:bg-white",
  secondary: "bg-white/10 text-white ring-1 ring-white/12 hover:bg-white/16",
  danger: "bg-danger text-white shadow-[0_0_36px_rgba(255,77,109,0.22)] hover:bg-[#ff6b84]",
  ghost: "bg-transparent text-white/78 hover:bg-white/10"
};

const sizes = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-14 px-5 text-base",
  icon: "h-11 w-11 p-0"
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-lg font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
