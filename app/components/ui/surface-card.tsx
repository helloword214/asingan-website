import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cx } from "./cx";

type SurfaceCardVariant = "chart" | "default" | "home" | "spotlight";

type SurfaceCardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  className?: string;
  variant?: SurfaceCardVariant;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">;

export function SurfaceCard<T extends ElementType = "section">({
  as,
  children,
  className,
  variant = "default",
  ...props
}: SurfaceCardProps<T>) {
  const Component = as ?? "section";

  return (
    <Component
      className={cx(
        "panel-card",
        "surface-card",
        variant === "spotlight" && "panel-card--spotlight",
        variant === "home" && "panel-card--home-panel",
        variant === "chart" && "panel-card--chart",
        className,
      )}
      data-reveal-stage="surface"
      {...props}
    >
      {children}
    </Component>
  );
}
