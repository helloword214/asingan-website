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
    <section
      className={cx("page-header", "surface-card", "heading-stage", "heading-stage--page", className)}
      data-reveal-stage="surface"
    >
      <div className="page-header__content heading-stage__content">
        {actions ? <div className="page-header__actions heading-stage__actions">{actions}</div> : null}
        <p className="eyebrow page-header__eyebrow heading-stage__eyebrow">{eyebrow}</p>
        <span aria-hidden="true" className="heading-stage__rail" />
        <div className="heading-stage__title-wrap">
          <h1 className="page-header__title heading-stage__title">{title}</h1>
        </div>
        {lede ? <p className="lede page-header__lede heading-stage__lede">{lede}</p> : null}
      </div>
    </section>
  );
}
