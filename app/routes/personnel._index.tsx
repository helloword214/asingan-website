import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import { AppImage } from "~/components/ui/app-image";
import { PageHeader } from "~/components/ui/page-header";
import { SectionHeading } from "~/components/ui/section-heading";
import { SurfaceCard } from "~/components/ui/surface-card";
import type { Route } from "./+types/personnel._index";
import { loadPersonnelPageData } from "~/lib/site-data.server";

type PersonnelSummary = Awaited<ReturnType<typeof loadPersonnelPageData>>["people"][number];
const PERSONNEL_MODAL_BREAKPOINT = "(max-width: 840px)";

export const meta: Route.MetaFunction = () => [
  { title: "Personnel | Asingan Fire Station" },
  {
    name: "description",
    content:
      "Personnel directory of Asingan Fire Station and the people behind station service.",
  },
];

export async function loader() {
  return loadPersonnelPageData();
}

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

function getPersonnelPreviewMeta(person: PersonnelSummary): string | null {
  if (person.currentDesignations[0]) {
    return person.currentDesignations[0];
  }

  if (person.leadershipRoleTitles[0]) {
    return person.leadershipRoleTitles[0];
  }

  if (person.lengthOfServiceDisplay) {
    return `Service: ${person.lengthOfServiceDisplay}`;
  }

  return null;
}

function getPersonnelPreviewNote(person: PersonnelSummary): string | null {
  if (person.currentStationLabel) {
    return `Currently serving at ${person.currentStationLabel}.`;
  }

  if (person.lengthOfServiceDisplay) {
    return `Years in service: ${person.lengthOfServiceDisplay}.`;
  }

  return null;
}

function PersonnelCardContent({
  actionText,
  person,
}: {
  actionText: string;
  person: PersonnelSummary;
}) {
  const previewMeta = getPersonnelPreviewMeta(person);

  return (
    <>
      <span className="media-frame media-frame--square media-frame--person-list person-list__media">
        {person.photo ? (
          <AppImage
            className="media-frame__image media-frame__image--cover"
            src={person.photo}
            alt=""
            aria-hidden="true"
          />
        ) : (
          <span
            className="media-frame__placeholder"
            aria-hidden="true"
          >
            Photo unavailable
          </span>
        )}
      </span>

      <span className="person-list__body">
        <span className="person-list__name">{person.displayName}</span>
        {previewMeta ? (
          <span className="person-list__meta">{previewMeta}</span>
        ) : null}
        <span className="person-list__cta">{actionText}</span>
      </span>
    </>
  );
}

export default function PersonnelIndex({ loaderData }: Route.ComponentProps) {
  const { people } = loaderData;
  const isPersonnelModalMode = useMediaQuery(PERSONNEL_MODAL_BREAKPOINT);
  const [openPersonnelIndex, setOpenPersonnelIndex] = useState<number | null>(null);
  const [visiblePersonnelIndex, setVisiblePersonnelIndex] = useState(0);
  const personnelModalRailRef = useRef<HTMLDivElement | null>(null);
  const personnelTriggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const visiblePersonnelIds = [
    "derrick-p-zulueta",
    "chester-bryan-a-serapion",
    "roselli-i-bernal",
    "michelle-p-bitantes",
    "wilfredo-n-oril-jr",
    "ronniel-c-mariano",
    "john-michael-l-benito",
    "jay-son-b-enriquez",
    "arcille-mae-y-caras",
    "ronald-l-carilla-jr",
    "mark-melvin-n-aquino",
    "jan-kriztoff-s-palis",
    "nolly-l-piso",
    "melanie-g-montero",
    "jovie-jov-b-rimando",
    "kier-benson-g-babasoro",
    "jefferson-c-cadaba",
    "alvin-r-lalica",
  ];
  const peopleById = new Map(people.map((person) => [person.id, person]));
  const sortedPeople = visiblePersonnelIds
    .map((personId) => peopleById.get(personId) ?? null)
    .filter((person): person is (typeof people)[number] => Boolean(person));

  useEffect(() => {
    if (!isPersonnelModalMode && openPersonnelIndex !== null) {
      setOpenPersonnelIndex(null);
    }
  }, [isPersonnelModalMode, openPersonnelIndex]);

  useEffect(() => {
    if (openPersonnelIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [openPersonnelIndex]);

  useEffect(() => {
    if (openPersonnelIndex === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenPersonnelIndex(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openPersonnelIndex]);

  useEffect(() => {
    if (openPersonnelIndex === null) {
      return;
    }

    const modalRail = personnelModalRailRef.current;
    const activeSlide = modalRail?.children[openPersonnelIndex];

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
  }, [openPersonnelIndex]);

  function openPersonnelModal(index: number) {
    setVisiblePersonnelIndex(index);
    setOpenPersonnelIndex(index);
  }

  function closePersonnelModal() {
    const focusIndex = visiblePersonnelIndex;
    setOpenPersonnelIndex(null);

    requestAnimationFrame(() => {
      personnelTriggerRefs.current[focusIndex]?.focus();
    });
  }

  function handlePersonnelModalScroll() {
    const modalRail = personnelModalRailRef.current;

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

    if (nextIndex !== visiblePersonnelIndex) {
      setVisiblePersonnelIndex(nextIndex);
    }
  }

  return (
    <div className="page">
      <div className="page__container">
        <PageHeader
          eyebrow="Personnel directory"
          lede="Meet the personnel who support station operations, response work, preparedness, and public service."
          title="The team behind Asingan's fire and emergency services."
        />

        <SurfaceCard>
          <SectionHeading
            eyebrow="Personnel list"
            title="Browse the personnel serving Asingan Fire Station."
          />

          <ul className="person-list">
            {sortedPeople.map((person, index) => (
              <li key={person.id}>
                {isPersonnelModalMode ? (
                  <button
                    aria-haspopup="dialog"
                    className="person-list__item person-list__item--trigger"
                    onClick={() => openPersonnelModal(index)}
                    ref={(element) => {
                      personnelTriggerRefs.current[index] = element;
                    }}
                    type="button"
                  >
                    <PersonnelCardContent actionText="Preview" person={person} />
                  </button>
                ) : (
                  <Link className="person-list__item" to={`/personnel/${person.id}`}>
                    <PersonnelCardContent actionText="View profile" person={person} />
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </SurfaceCard>

        {isPersonnelModalMode && openPersonnelIndex !== null ? (
          <div
            aria-labelledby={`personnel-modal-title-${visiblePersonnelIndex}`}
            aria-modal="true"
            className="leadership-modal"
            role="dialog"
          >
            <button
              aria-label="Close personnel preview modal"
              className="leadership-modal__backdrop"
              onClick={closePersonnelModal}
              type="button"
            />

            <div className="leadership-modal__sheet person-preview-modal__sheet">
              <div className="leadership-modal__header">
                <div className="leadership-modal__header-copy">
                  <p className="leadership-modal__eyebrow">Personnel directory</p>
                  <p className="leadership-modal__hint">
                    Profile {visiblePersonnelIndex + 1} of {sortedPeople.length}. Swipe to browse.
                  </p>
                </div>
                <button
                  aria-label="Close personnel preview modal"
                  className="leadership-modal__close"
                  onClick={closePersonnelModal}
                  type="button"
                >
                  Close
                </button>
              </div>

              <div className="leadership-modal__progress" aria-hidden="true">
                {sortedPeople.map((person, index) => (
                  <span
                    className={`leadership-modal__progress-dot${
                      index === visiblePersonnelIndex ? " is-active" : ""
                    }`}
                    key={`personnel-modal-progress-${person.id}`}
                  />
                ))}
              </div>

              <div
                className="leadership-modal__viewport"
                onScroll={handlePersonnelModalScroll}
                ref={personnelModalRailRef}
              >
                {sortedPeople.map((person, index) => {
                  const previewMeta = getPersonnelPreviewMeta(person);
                  const previewNote = getPersonnelPreviewNote(person);

                  return (
                    <article
                      className="leadership-modal__slide"
                      key={`personnel-modal-slide-${person.id}`}
                    >
                      <div className="person-preview-modal__card">
                        <div className="media-frame media-frame--portrait media-frame--profile person-preview-modal__media">
                          {person.photo ? (
                            <AppImage
                              className="media-frame__image media-frame__image--contain"
                              src={person.photo}
                              alt={person.displayName}
                            />
                          ) : (
                            <div className="media-frame__placeholder">Photo unavailable</div>
                          )}
                        </div>

                        <div className="person-preview-modal__body">
                          {previewMeta ? (
                            <p className="person-preview-modal__eyebrow">{previewMeta}</p>
                          ) : null}
                          <h2 id={`personnel-modal-title-${index}`}>{person.displayName}</h2>
                          {previewNote ? (
                            <p className="person-preview-modal__note">{previewNote}</p>
                          ) : null}
                          {person.lengthOfServiceDisplay ? (
                            <div className="badge-row person-preview-modal__facts">
                              <span className="status-pill status-pill--neutral">
                                Service: {person.lengthOfServiceDisplay}
                              </span>
                            </div>
                          ) : null}
                          <div className="button-row person-preview-modal__actions">
                            <Link className="button button--secondary" to={`/personnel/${person.id}`}>
                              View full profile
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
