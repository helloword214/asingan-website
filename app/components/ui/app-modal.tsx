import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { cx } from "./cx";

type AppModalProps = {
  ariaLabelledBy: string;
  bodyClassName?: string;
  children: ReactNode;
  className?: string;
  closeLabel: string;
  headerClassName?: string;
  headerContent?: ReactNode;
  onClose: () => void;
  progress?: ReactNode;
  sheetClassName?: string;
};

export function AppModal({
  ariaLabelledBy,
  bodyClassName,
  children,
  className,
  closeLabel,
  headerClassName,
  headerContent,
  onClose,
  progress,
  sheetClassName,
}: AppModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (bodyClassName) {
      document.body.classList.add(bodyClassName);
    }

    document.body.style.overflow = "hidden";

    return () => {
      if (bodyClassName) {
        document.body.classList.remove(bodyClassName);
      }

      document.body.style.overflow = previousOverflow;
    };
  }, [bodyClassName]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      aria-labelledby={ariaLabelledBy}
      aria-modal="true"
      className={cx("app-modal", className)}
      role="dialog"
    >
      <button
        aria-label={closeLabel}
        className="app-modal__backdrop"
        onClick={onClose}
        type="button"
      />

      <div className={cx("app-modal__sheet", sheetClassName)}>
        <div className={cx("app-modal__header", headerClassName)}>
          {headerContent ? <div className="app-modal__header-copy">{headerContent}</div> : null}
          <button
            aria-label={closeLabel}
            className="app-modal__close"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        {progress ? (
          <div aria-hidden="true" className="app-modal__progress">
            {progress}
          </div>
        ) : null}

        {children}
      </div>
    </div>,
    document.body,
  );
}
