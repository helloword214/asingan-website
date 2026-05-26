import type { ReactNode } from "react";

import { cx } from "./cx";

type SectionHeadingProps = {
  actions?: ReactNode;
  className?: string;
  eyebrow?: string;
  title: ReactNode;
};

export function SectionHeading({ actions, className, eyebrow, title }: SectionHeadingProps) {
  return (
    <div className={cx("section-heading", "heading-stage", "heading-stage--section", className)}>
      <div className="section-heading__content heading-stage__content">
        {eyebrow ? <p className="eyebrow section-heading__eyebrow heading-stage__eyebrow">{eyebrow}</p> : null}
        <span aria-hidden="true" className="heading-stage__rail" />
        <div className="heading-stage__title-wrap">
          <h2 className="section-heading__title heading-stage__title">{title}</h2>
        </div>
      </div>
      {actions ? <div className="section-heading__actions heading-stage__actions">{actions}</div> : null}
    </div>
  );
}
