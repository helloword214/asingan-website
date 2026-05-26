import type { ReactNode } from "react";

import { cx } from "./cx";

type SectionIntroProps = {
  children?: ReactNode;
  className?: string;
  eyebrow?: string;
  lede?: ReactNode;
  title?: ReactNode;
  titleAs?: "h2" | "h3";
};

export function SectionIntro({
  children,
  className,
  eyebrow,
  lede,
  title,
  titleAs = "h2",
}: SectionIntroProps) {
  const TitleTag = titleAs;
  const hasLead = Boolean(eyebrow || title || lede);

  return (
    <div className={cx("section-intro", "heading-stage", "heading-stage--section", className)}>
      <div className="section-intro__content heading-stage__content">
        {eyebrow ? <p className="eyebrow section-intro__eyebrow heading-stage__eyebrow">{eyebrow}</p> : null}
        {hasLead ? <span aria-hidden="true" className="heading-stage__rail" /> : null}
        {title ? (
          <div className="heading-stage__title-wrap">
            <TitleTag className="section-intro__title heading-stage__title">{title}</TitleTag>
          </div>
        ) : null}
        {lede ? <p className="lede section-intro__lede heading-stage__lede">{lede}</p> : null}
        {children ? <div className="section-intro__body heading-stage__support">{children}</div> : null}
      </div>
    </div>
  );
}
