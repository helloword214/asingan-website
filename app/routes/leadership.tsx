import { useState } from "react";
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

function splitLeadershipNote(note: string): { preview: string; remainder: string } {
  const trimmed = note.trim();

  if (trimmed.length <= LEADERSHIP_NOTE_PREVIEW_LENGTH) {
    return { preview: trimmed, remainder: "" };
  }

  let cutIndex = trimmed.lastIndexOf(" ", LEADERSHIP_NOTE_PREVIEW_LENGTH);

  if (cutIndex < Math.floor(LEADERSHIP_NOTE_PREVIEW_LENGTH * 0.7)) {
    cutIndex = LEADERSHIP_NOTE_PREVIEW_LENGTH;
  }

  return {
    preview: `${trimmed.slice(0, cutIndex).trimEnd()}...`,
    remainder: trimmed.slice(cutIndex).trimStart(),
  };
}

function LeadershipNote({ note, className }: { note: string; className: string }) {
  const [expanded, setExpanded] = useState(false);
  const { preview, remainder } = splitLeadershipNote(note);

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

export default function Leadership({ loaderData }: Route.ComponentProps) {
  const { fireMarshalTimeline } = loaderData;
  const currentFireMarshal =
    fireMarshalTimeline.find((entry) => entry.status === "present") ?? fireMarshalTimeline[0] ?? null;
  const pastFireMarshals = currentFireMarshal
    ? fireMarshalTimeline.filter((entry) => entry.id !== currentFireMarshal.id)
    : [];

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
                  <img
                    className="media-frame__image media-frame__image--contain"
                    src={currentFireMarshal.image}
                    alt={currentFireMarshal.displayName}
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
            actions={<span className="status-pill status-pill--neutral">{fireMarshalTimeline.length} fire marshals</span>}
            eyebrow="Leadership succession"
            title="A continuing line of fire marshal service."
          />

          <div className="leadership-flow" aria-label="Fire marshal succession timeline">
            {(pastFireMarshals.length > 0 ? pastFireMarshals : fireMarshalTimeline).map((entry) => (
              <article className="leadership-entry" key={`${entry.id}-${entry.termStartDisplay}`}>
                <div className="leadership-entry__track" aria-hidden="true">
                  <span className="leadership-entry__dot" />
                </div>

                <div className="leadership-entry__card">
                  <div className="media-frame media-frame--portrait media-frame--timeline leadership-entry__media">
                    {entry.image ? (
                      <img
                        className="media-frame__image media-frame__image--contain"
                        src={entry.image}
                        alt={entry.displayName}
                      />
                    ) : (
                      <div className="media-frame__placeholder">Photo unavailable</div>
                    )}
                  </div>

                  <div className="leadership-entry__body">
                    <div className="leadership-entry__meta">
                      <div className="leadership-entry__time">
                        <p className="timeline-card__term">
                          {entry.termStartDisplay} to {entry.termEndDisplay}
                        </p>
                        <p className="leadership-tenure">
                          Leadership term: {formatLeadershipTerm(entry)}
                        </p>
                      </div>
                      <span
                        className={`status-pill ${
                          entry.status === "present"
                            ? "status-pill--confirmed"
                            : "status-pill--neutral"
                        }`}
                      >
                        {entry.status === "present" ? "Current fire marshal" : "Past fire marshal"}
                      </span>
                    </div>

                    <h3>{entry.displayName}</h3>
                    {(entry.notes?.length ?? 0) > 0 ? (
                      <LeadershipNote
                        className="leadership-entry__note"
                        note={entry.notes?.[0] ?? ""}
                      />
                    ) : (
                      <p className="leadership-entry__note">
                        Part of the station's continuing line of leadership and public service.
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
