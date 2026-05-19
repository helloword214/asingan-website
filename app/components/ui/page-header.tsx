import type { ReactNode } from "react";

import { cx } from "./cx";

type PageHeaderProps = {
  actions?: ReactNode;
  className?: string;
  eyebrow: string;
  lede?: ReactNode;
  title: ReactNode;
};

export function PageHeader({ actions, className, eyebrow, lede, title }: PageHeaderProps) {
  return (
    <section className={cx("page-header", "surface-card", className)}>
      {actions}
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {lede ? <p className="lede">{lede}</p> : null}
    </section>
  );
}
