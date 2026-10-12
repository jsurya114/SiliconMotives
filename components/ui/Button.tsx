import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowIcon } from "./icons";

type Variant = "monsoon" | "lagoon" | "ghost";

type Common = { children: string; variant?: Variant; icon?: ReactNode; className?: string };

function Inner({ children, icon }: { children: string; icon?: ReactNode }) {
  return (
    <>
      <span className="btn__label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      <span className="btn__icon" aria-hidden="true">
        {icon ?? <ArrowIcon />}
      </span>
    </>
  );
}

const cls = (variant: Variant, className = "") =>
  `btn ${variant === "lagoon" ? "btn--lagoon" : variant === "ghost" ? "btn--ghost" : ""} ${className}`;

export function ButtonLink({
  children,
  variant = "monsoon",
  icon,
  className,
  ...rest
}: Common & Omit<ComponentPropsWithoutRef<"a">, "children">) {
  return (
    <a className={cls(variant, className)} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </a>
  );
}

export function Button({
  children,
  variant = "monsoon",
  icon,
  className,
  ...rest
}: Common & Omit<ComponentPropsWithoutRef<"button">, "children">) {
  return (
    <button className={cls(variant, className)} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
}
