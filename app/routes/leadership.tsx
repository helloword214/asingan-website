import { useEffect, useRef, useState } from "react";
import { AppImage } from "~/components/ui/app-image";
import { AppModal } from "~/components/ui/app-modal";
import { PageHeader } from "~/components/ui/page-header";
import { SectionHeading } from "~/components/ui/section-heading";
import { SurfaceCard } from "~/components/ui/surface-card";
import type { Route } from "./+types/leadership";
import { loadLeadershipPageData } from "~/lib/site-data.server";

export const meta: Route.MetaFunction = () => [
  { title: "Leadership | Asingan Fire Station" },
  {
    name: "description",
    content: "Leadership history of Asingan Fire Station and the line of fire marshals who guided station service.",
  },
];

export async function loader() {
  return loadLeadershipPageData();
}

const LEADERSHIP_NOTE_PREVIEW_LENGTH = 180;
const LEADERSHIP_NOTE_PREVIEW_LENGTH_COMPACT = 108;
const LEADERSHIP_MODAL_BREAKPOINT = "(max-width: 840px)";

type FireMarshalEntry = Awaited<ReturnType<typeof loadLeadershipPageData>>["fireMarshalTimeline"][number];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    const updateMatches = () => setMatches(mediaQuery.matches);

    updateMatches();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMatches);
      return () => mediaQuery.removeEventListener("change", updateMatches);
    }

    mediaQuery.addListener(updateMatches);
    return () => mediaQuery.removeListener(updateMatches);
  }, [query]);

  return matches;
}

function splitLeadershipNote(
  note: string,
  previewLength: number = LEADERSHIP_NOTE_PREVIEW_LENGTH,
): { preview: string; remainder: string } {
  const trimmed = note.trim();

  if (trimmed.length <= previewLength) {
    return { preview: trimmed, remainder: "" };
  }

  let cutIndex = trimmed.lastIndexOf(" ", previewLength);

  if (cutIndex < Math.floor(previewLength * 0.7)) {
    cutIndex = previewLength;
  }

  return {
    preview: `${trimmed.slice(0, cutIndex).trimEnd()}...`,
    remainder: trimmed.slice(cutIndex).trimStart(),
  };
}

function LeadershipNote({
  note,
  className,
  previewLength = LEADERSHIP_NOTE_PREVIEW_LENGTH,
}: {
  note: string;
  className: string;
  previewLength?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const { preview, remainder } = splitLeadershipNote(note, previewLength);

  if (!remainder) {
    return <p className={className}>{note}</p>;
  }

  return (
    <div className="leadership-note">
      <p className={className}>
        {expanded ? note : preview}
        {" "}
        <button
          aria-expanded={expanded}
          className="leadership-note__toggle"
          onClick={() => setExpanded((value) => !value)}
          type="button"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      </p>
    </div>
  );
}

function extractYear(value: string): number | null {
  const match = value.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
}

function formatLeadershipTerm(entry: {
  termStartDisplay: string;
  termEndDisplay: string;
  termStartIso?: string | null;
  termEndIso?: string | null;
}): string {
  if (entry.termStartIso) {
    const startDate = new Date(entry.termStartIso);
    const endDate = entry.termEndIso ? new Date(entry.termEndIso) : new Date();
    let monthCount =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth());

    if (endDate.getDate() < startDate.getDate()) {
      monthCount -= 1;
    }

    monthCount = Math.max(monthCount, 0);

    const years = Math.floor(monthCount / 12);
    const months = monthCount % 12;

    if (years > 0 && months > 0) {
      return `${years} year${years === 1 ? "" : "s"}, ${months} month${months === 1 ? "" : "s"}`;
    }

    if (years > 0) {
      return `${years} year${years === 1 ? "" : "s"}`;
    }

    const safeMonths = Math.max(months, 1);
    return `${safeMonths} month${safeMonths === 1 ? "" : "s"}`;
  }

  const startYear = extractYear(entry.termStartDisplay);
  const endYear = entry.termEndIso
    ? new Date(entry.termEndIso).getFullYear()
    : extractYear(entry.termEndDisplay);

  if (startYear && endYear && endYear > startYear) {
    const years = endYear - startYear;
    return `${years} year${years === 1 ? "" : "s"}`;
  }

  return "Length not listed";
}

function formatLeadershipTermCompact(entry: {
  termStartDisplay: string;
  termEndDisplay: string;
  termStartIso?: string | null;
  termEndIso?: string | null;
}): string {
  const fullTerm = formatLeadershipTerm(entry);

  return fullTerm
    .replace(/ years?/g, " yr")
    .replace(/ months?/g, " mo")
    .replace(",", "");
}

function formatLeadershipDateCompact(entry: {
  termStartDisplay: string;
  termEndDisplay: string;
  termStartIso?: string | null;
  termEndIso?: string | null;
}): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  });

  if (entry.termStartIso) {
    const startDate = formatter.format(new Date(entry.termStartIso));
    const endDate = entry.termEndIso
      ? formatter.format(new Date(entry.termEndIso))
      : entry.termEndDisplay;
    return `${startDate} - ${endDate}`;
  }

  const startYear = extractYear(entry.termStartDisplay);
  const endYear = entry.termEndIso
    ? new Date(entry.termEndIso).getFullYear()
    : extractYear(entry.termEndDisplay);

  if (startYear && endYear) {
    return `${startYear} - ${endYear}`;
  }

  return `${entry.termStartDisplay} - ${entry.termEndDisplay}`;
}

function formatLeadershipDatePreview(entry: {
  termStartDisplay: string;
  termEndDisplay: string;
  termStartIso?: string | null;
  termEndIso?: string | null;
}): string {
  const startYear = entry.termStartIso
    ? new Date(entry.termStartIso).getFullYear()
    : extractYear(entry.termStartDisplay);
  const endYear = entry.termEndIso
    ? new Date(entry.termEndIso).getFullYear()
    : extractYear(entry.termEndDisplay);

  if (startYear && endYear) {
    return startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;
  }

  return formatLeadershipDateCompact(entry);
}

function LeadershipEntryMedia({
  entry,
  className,
}: {
  entry: FireMarshalEntry;
  className: string;
}) {
  return (
    <div className={className}>
      {entry.image ? (
        <AppImage
          className="media-frame__image media-frame__image--contain"
          src={entry.image}
          alt={entry.displayName}
        />
      ) : (
        <div className="media-frame__placeholder">Photo unavailable</div>
      )}
    </div>
  );
}

function LeadershipEntryDetails({
  entry,
  headingLevel,
  compact = false,
  previewLength = LEADERSHIP_NOTE_PREVIEW_LENGTH,
  showStatus = true,
  titleId,
}: {
  entry: FireMarshalEntry;
  headingLevel: "h2" | "h3";
  compact?: boolean;
  previewLength?: number;
  showStatus?: boolean;
  titleId?: string;
}) {
  const HeadingTag = headingLevel;

  return (
    <>
      <div className="leadership-entry__meta">
        <div className="leadership-entry__time">
          <p className="timeline-card__term">
            {compact
              ? formatLeadershipDateCompact(entry)
              : `${entry.termStartDisplay} to ${entry.termEndDisplay}`}
          </p>
          <p className="leadership-tenure">
            {compact ? `Term ${formatLeadershipTermCompact(entry)}` : `Leadership term: ${formatLeadershipTerm(entry)}`}
          </p>
        </div>
        {showStatus ? (
          <span
            className={`status-pill ${
              entry.status === "present" ? "status-pill--confirmed" : "status-pill--neutral"
            }`}
          >
            {entry.status === "present" ? "Current fire marshal" : "Past fire marshal"}
          </span>
        ) : null}
      </div>

      <HeadingTag id={titleId}>{entry.displayName}</HeadingTag>
      {(entry.notes?.length ?? 0) > 0 ? (
        <LeadershipNote
          className="leadership-entry__note"
          note={entry.notes?.[0] ?? ""}
          previewLength={previewLength}
        />
      ) : (
        <p className="leadership-entry__note">
          Part of the station's continuing line of leadership and public service.
        </p>
      )}
    </>
  );
}

function LeadershipMobilePreviewCard({
  entry,
  onOpen,
  buttonRef,
}: {
  entry: FireMarshalEntry;
  onOpen: () => void;
  buttonRef?: (element: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      aria-haspopup="dialog"
      className="leadership-mobile-card"
      onClick={onOpen}
      ref={buttonRef}
      type="button"
    >
      <LeadershipEntryMedia
        className="media-frame media-frame--portrait media-frame--timeline leadership-mobile-card__media"
        entry={entry}
      />

      <div className="leadership-mobile-card__body">
        <div className="leadership-mobile-card__topline">
          <p className="timeline-card__term">{formatLeadershipDatePreview(entry)}</p>
          <p className="leadership-tenure">{formatLeadershipTermCompact(entry)}</p>
        </div>
        <h3>{entry.displayName}</h3>
        <span className="leadership-mobile-card__hint">View profile</span>
      </div>
    </button>
  );
}

export default function Leadership({ loaderData }: Route.ComponentProps) {
  const { fireMarshalTimeline } = loaderData;
  const isLeadershipModalMode = useMediaQuery(LEADERSHIP_MODAL_BREAKPOINT);
  const [openLeadershipIndex, setOpenLeadershipIndex] = useState<number | null>(null);
  const [visibleLeadershipIndex, setVisibleLeadershipIndex] = useState(0);
  const leadershipModalRailRef = useRef<HTMLDivElement | null>(null);
  const leadershipTriggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const currentFireMarshal =
    fireMarshalTimeline.find((entry) => entry.status === "present") ?? fireMarshalTimeline[0] ?? null;
  const pastFireMarshals = currentFireMarshal
    ? fireMarshalTimeline.filter((entry) => entry.id !== currentFireMarshal.id)
    : [];
  const leadershipHistoryEntries =
    pastFireMarshals.length > 0 ? pastFireMarshals : fireMarshalTimeline;

  useEffect(() => {
    if (!isLeadershipModalMode && openLeadershipIndex !== null) {
      setOpenLeadershipIndex(null);
    }
  }, [isLeadershipModalMode, openLeadershipIndex]);

  useEffect(() => {
    if (openLeadershipIndex === null) {
      return;
    }

    const modalRail = leadershipModalRailRef.current;
    const activeSlide = modalRail?.children[openLeadershipIndex];

    if (!(activeSlide instanceof HTMLElement)) {
      return;
    }

    requestAnimationFrame(() => {
      activeSlide.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "start",
      });
    });
  }, [openLeadershipIndex]);

  function openLeadershipModal(index: number) {
    setVisibleLeadershipIndex(index);
    setOpenLeadershipIndex(index);
  }

  function closeLeadershipModal() {
    const focusIndex = visibleLeadershipIndex;
    setOpenLeadershipIndex(null);

    requestAnimationFrame(() => {
      leadershipTriggerRefs.current[focusIndex]?.focus();
    });
  }

  function handleLeadershipModalScroll() {
    const modalRail = leadershipModalRailRef.current;

    if (!modalRail) {
      return;
    }

    const slides = Array.from(modalRail.children).filter(
      (child): child is HTMLElement => child instanceof HTMLElement,
    );

    if (slides.length === 0) {
      return;
    }

    const nextIndex = slides.reduce(
      (closestIndex, slide, index) => {
        const currentDistance = Math.abs(slide.offsetLeft - modalRail.scrollLeft);
        const closestDistance = Math.abs(slides[closestIndex].offsetLeft - modalRail.scrollLeft);
        return currentDistance < closestDistance ? index : closestIndex;
      },
      0,
    );

    if (nextIndex !== visibleLeadershipIndex) {
      setVisibleLeadershipIndex(nextIndex);
    }
  }

  return (
    <div className="page">
      <div className="page__container">
        <PageHeader
          eyebrow="Leadership"
          lede="The station's line of fire marshals reflects continuity, stewardship, and public service across the years."
          title="Leadership in service of a safer Asingan."
        />

        {currentFireMarshal ? (
          <SurfaceCard className="leadership-spotlight" variant="spotlight">
            <SectionHeading
              actions={<span className="status-pill status-pill--confirmed">Current fire marshal</span>}
              eyebrow="Current leadership"
              title="The present fire marshal guiding station service."
            />

            <div className="leadership-spotlight__layout">
              <div className="media-frame media-frame--portrait media-frame--timeline leadership-spotlight__media">
                {currentFireMarshal.image ? (
                  <AppImage
                    className="media-frame__image media-frame__image--contain"
                    src={currentFireMarshal.image}
                    alt={currentFireMarshal.displayName}
                    priority
                  />
                ) : (
                  <div className="media-frame__placeholder">Photo unavailable</div>
                )}
              </div>

              <div className="leadership-spotlight__body">
                <p className="timeline-card__term">
                  {currentFireMarshal.termStartDisplay} to {currentFireMarshal.termEndDisplay}
                </p>
                <p className="leadership-tenure">
                  Leadership term: {formatLeadershipTerm(currentFireMarshal)}
                </p>
                <h2>{currentFireMarshal.displayName}</h2>
                {(currentFireMarshal.notes?.length ?? 0) > 0 ? (
                  <LeadershipNote
                    className="leadership-spotlight__note"
                    note={currentFireMarshal.notes?.[0] ?? ""}
                  />
                ) : (
                  <p className="leadership-spotlight__note">
                    Current station leadership continues the line of public service and readiness in
                    Asingan.
                  </p>
                )}
              </div>
            </div>
          </SurfaceCard>
        ) : null}

        <SurfaceCard className="leadership-flow-card">
          <SectionHeading
            eyebrow="Leadership succession"
            title="A continuing line of fire marshal service."
          />

          <div
            className={`leadership-flow${isLeadershipModalMode ? " leadership-flow--compact" : ""}`}
            aria-label="Fire marshal succession timeline"
          >
            {leadershipHistoryEntries.map((entry, index) =>
              isLeadershipModalMode ? (
                <LeadershipMobilePreviewCard
                  buttonRef={(element) => {
                    leadershipTriggerRefs.current[index] = element;
                  }}
                  entry={entry}
                  key={`${entry.id}-${entry.termStartDisplay}`}
                  onOpen={() => openLeadershipModal(index)}
                />
              ) : (
                <article className="leadership-entry" key={`${entry.id}-${entry.termStartDisplay}`}>
                  <div className="leadership-entry__track" aria-hidden="true">
                    <span className="leadership-entry__dot" />
                  </div>

                  <div className="leadership-entry__card">
                    <LeadershipEntryMedia
                      className="media-frame media-frame--portrait media-frame--timeline leadership-entry__media"
                      entry={entry}
                    />

                    <div className="leadership-entry__body">
                      <LeadershipEntryDetails entry={entry} headingLevel="h3" />
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        </SurfaceCard>

        {isLeadershipModalMode && openLeadershipIndex !== null ? (
          <AppModal
            ariaLabelledBy={`leadership-modal-title-${visibleLeadershipIndex}`}
            bodyClassName="is-app-modal-header-hidden"
            className="directory-preview-modal"
            closeLabel="Close fire marshal profile modal"
            headerContent={
              <>
                <p className="app-modal__eyebrow">Leadership succession</p>
                <p className="app-modal__hint">
                  Profile {visibleLeadershipIndex + 1} of {leadershipHistoryEntries.length}. Swipe to browse.
                </p>
              </>
            }
            onClose={closeLeadershipModal}
            progress={leadershipHistoryEntries.map((entry, index) => (
              <span
                className={`app-modal__progress-dot${
                  index === visibleLeadershipIndex ? " is-active" : ""
                }`}
                key={`leadership-modal-progress-${entry.id}-${entry.termStartDisplay}`}
              />
            ))}
            sheetClassName="directory-preview-modal__sheet"
          >
            <div
              className="app-modal__viewport"
              onScroll={handleLeadershipModalScroll}
              ref={leadershipModalRailRef}
            >
                {leadershipHistoryEntries.map((entry, index) => (
                  <article
                    className="app-modal__slide"
                    key={`leadership-modal-slide-${entry.id}-${entry.termStartDisplay}`}
                  >
                    <div className="leadership-entry__card leadership-entry__card--modal">
                      <LeadershipEntryMedia
                        className="media-frame media-frame--portrait media-frame--timeline leadership-entry__media leadership-entry__media--modal"
                        entry={entry}
                      />

                      <div className="leadership-entry__body leadership-entry__body--modal">
                        <LeadershipEntryDetails
                          compact
                          entry={entry}
                          headingLevel="h2"
                          previewLength={LEADERSHIP_NOTE_PREVIEW_LENGTH_COMPACT}
                          showStatus={false}
                          titleId={`leadership-modal-title-${index}`}
                        />
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </AppModal>
        ) : null}
      </div>
    </div>
  );
}
