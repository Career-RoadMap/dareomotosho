import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost" | "accent";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className">;

/**
 * Link-styled button. Primary = Signature Blue. Accent = the single amber
 * emphasis (use SPARINGLY — at most one prominent amber element per region).
 * Soft corners on interactive elements; quiet, eased hover to Blue-lift.
 */
const base =
  "inline-flex items-center justify-center rounded-lg px-7 py-3.5 text-small font-medium tracking-wide transition-all duration-300 ease-calm focus-visible:ring-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-signature text-paper hover:bg-blue-lift active:bg-blue-lift",
  ghost:
    "border border-signature/25 text-signature hover:border-blue-lift hover:text-blue-lift",
  accent:
    "bg-amber text-ink hover:brightness-[0.97] active:brightness-95 shadow-sm",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  );
}
