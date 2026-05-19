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
    <div className={cx("section-heading", className)}>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {actions ? <div className="section-heading__actions">{actions}</div> : null}
    </div>
  );
}
