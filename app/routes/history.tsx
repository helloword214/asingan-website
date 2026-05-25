import { PageHeader } from "~/components/ui/page-header";
import { SectionHeading } from "~/components/ui/section-heading";
import { SurfaceCard } from "~/components/ui/surface-card";
import type { Route } from "./+types/history";
import { loadHistoryPageData } from "~/lib/site-data.server";

export const meta: Route.MetaFunction = () => [
  { title: "History | Asingan Fire Station" },
  {
    name: "description",
    content: "History of service, growth, and station development at Asingan Fire Station.",
  },
];

export async function loader() {
  return loadHistoryPageData();
}

const demolitionPhotos = [
  {
    src: "/images/mock-station/history-fs/demolation-history/demolation-oldfs-1.jpeg",
    alt: "Workers removing the roof of the earlier Asingan Fire Station during demolition",
  },
  {
    src: "/images/mock-station/history-fs/demolation-history/demolation-oldfs-2.jpeg",
    alt: "Earlier Asingan Fire Station during demolition with site covering in front",
  },
  {
    src: "/images/mock-station/history-fs/demolation-history/demolation-oldfs-3.jpeg",
    alt: "Earlier Asingan Fire Station demolition progress from the side yard",
  },
  {
    src: "/images/mock-station/history-fs/demolation-history/demolation-oldfs-4.jpeg",
    alt: "Front view of the earlier Asingan Fire Station during demolition works",
  },
];

const awardPhoto2019 = {
  src: "/images/mock-station/history-fs/awards/best-municipal-fire-station-pangasinan-2019.jpg",
  alt: "Asingan Fire Station personnel and local officials during the 2019 recognition as Best Municipal Fire Station in Pangasinan",
};

const awardPhotos2022 = [
  {
    src: "/images/mock-station/history-fs/awards/best-municipal-fire-station-region1-2022-2.jpg",
    alt: "Asingan Fire Station personnel with fire trucks in front of the station during the 2022 regional recognition",
    caption: "Featured station photo during the 2022 regional recognition",
    featured: true,
  },
  {
    src: "/images/mock-station/history-fs/awards/best-municipal-fire-station-region1-2022-1.jpg",
    alt: "Recognition layout for Asingan Fire Station as Best Municipal Fire Station of BFP Region 1 in 2022",
    caption: "Recognition graphic from the 2022 award post",
  },
  {
    src: "/images/mock-station/history-fs/awards/best-municipal-fire-station-region1-2022-3.jpg",
    alt: "Group photo from the 2022 BFP Region 1 recognition of Asingan Fire Station",
    caption: "Group photo from the 2022 regional recognition",
  },
];

export default function History({ loaderData }: Route.ComponentProps) {
  const { introNarrative, shortVersion, timeline } = loaderData;
  const demolitionEvent =
    timeline.find((event) => event.id === "earlier-fire-station-demolition-2017") ?? null;
  const award2019Event =
    timeline.find((event) => event.id === "best-municipal-fire-station-pangasinan-2019") ?? null;
  const award2022Event =
    timeline.find((event) => event.id === "best-municipal-fire-station-second-class-region-1-2022") ??
    null;

  return (
    <div className="page">
      <div className="page__container">
        <PageHeader
          eyebrow="History"
          lede="The history of Asingan Fire Station traces the station's growth, milestones, and continuing service to the municipality over the years."
          title="A station story shaped by service and growth."
        />

        <section className="content-grid">
          <SurfaceCard as="article">
            <p className="eyebrow">Historical overview</p>
            <div className="story-copy">
              {introNarrative.map((paragraph) => (
                <p className="story-copy__paragraph" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard as="article">
            <p className="eyebrow">In brief</p>
            <h2>How the station took root in Asingan.</h2>
            <p className="lede">{shortVersion}</p>
          </SurfaceCard>
        </section>

        <SurfaceCard>
          <SectionHeading eyebrow="Timeline" title="Moments that shaped station service through the years." />
          <div className="story-stack">
            {timeline.map((event) => (
              <article className="story-card" key={event.id}>
                <div className="story-card__header">
                  <div>
                    <p className="story-card__date">{event.dateDisplay}</p>
                    <h3>{event.title}</h3>
                  </div>
                  <span className="status-pill status-pill--neutral">{event.type}</span>
                </div>
                <p className="story-card__summary">{event.summary}</p>
              </article>
            ))}
          </div>
        </SurfaceCard>

        <section className="content-grid history-feature-grid history-feature-grid--transition">
          <SurfaceCard as="article" className="history-card history-card--earlier" variant="spotlight">
            <p className="eyebrow">Earlier station building</p>
            <div className="asset-spotlight">
              <div className="media-frame media-frame--landscape media-frame--asset-hero">
                <img
                  className="media-frame__image media-frame__image--cover"
                  src="/images/mock-station/history-fs/firestation-old.png"
                  alt="Earlier Asingan Fire Station building kept in the history image set"
                />
              </div>
              <div className="asset-spotlight__body">
                <h2>Earlier Asingan Fire Station structure before demolition</h2>
                <p className="story-card__summary">
                  The earlier station building remains an important part of the station's story
                  before the transition into a newer home.
                </p>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard as="article" className="history-card history-card--demolition" variant="spotlight">
            <p className="eyebrow">Demolition photo set</p>
            {demolitionEvent ? (
              <>
                <h2>{demolitionEvent.title}</h2>
                <p className="lede">{demolitionEvent.summary}</p>
                <div className="badge-row">
                  <span className="status-pill status-pill--neutral">{demolitionEvent.type}</span>
                  <span className="status-pill status-pill--neutral">{demolitionEvent.dateDisplay}</span>
                </div>
              </>
            ) : null}
            <div className="history-photo-grid history-photo-grid--demolition">
              {demolitionPhotos.map((photo, index) => (
                <figure className="history-photo-card" key={photo.src}>
                  <div className="media-frame media-frame--landscape">
                    <img
                      className="media-frame__image media-frame__image--cover"
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="history-photo-card__caption">
                    {String(index + 1).padStart(2, "0")} Earlier station during demolition
                  </figcaption>
                </figure>
              ))}
            </div>
            <ul className="note-list">
              <li>These photos capture the closing chapter of the earlier station building.</li>
              <li>They help mark the station's transition into a newer home.</li>
            </ul>
          </SurfaceCard>
        </section>

        <section className="content-grid history-feature-grid history-feature-grid--recognition">
          <SurfaceCard
            as="article"
            className="history-card history-card--recognition-2019"
            variant="spotlight"
          >
            <div className="history-recognition-card history-recognition-card--2019">
              <div className="history-recognition-copy">
                <p className="eyebrow">2019 recognition</p>
                {award2019Event ? (
                  <>
                    <h2>{award2019Event.title}</h2>
                    <p className="lede">{award2019Event.summary}</p>
                  </>
                ) : null}
              </div>
              <figure className="history-photo-card">
                <div className="media-frame media-frame--landscape">
                  <img
                    className="media-frame__image media-frame__image--cover"
                    src={awardPhoto2019.src}
                    alt={awardPhoto2019.alt}
                    loading="lazy"
                  />
                </div>
                <figcaption className="history-photo-card__caption">
                  Best Municipal Fire Station in Pangasinan for 2019
                </figcaption>
              </figure>
            </div>
          </SurfaceCard>

          <SurfaceCard
            as="article"
            className="history-card history-card--recognition-2022"
            variant="spotlight"
          >
            <div className="history-recognition-card history-recognition-card--2022">
              <div className="history-recognition-copy">
                <p className="eyebrow">2022 recognition</p>
                {award2022Event ? (
                  <>
                    <h2>{award2022Event.title}</h2>
                    <p className="lede">{award2022Event.summary}</p>
                  </>
                ) : null}
              </div>
              <div className="history-award-grid history-award-grid--2022">
                {awardPhotos2022.map((photo) => (
                  <figure
                    className={`history-photo-card${photo.featured ? " history-award-card--featured" : ""}`}
                    key={photo.src}
                  >
                    <div
                      className={`media-frame history-award-frame${photo.featured ? " history-award-frame--featured" : " history-award-frame--supporting"}`}
                    >
                      <img
                        className="history-award-frame__image"
                        src={photo.src}
                        alt={photo.alt}
                        loading="lazy"
                      />
                    </div>
                    <figcaption className="history-photo-card__caption">{photo.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </SurfaceCard>
        </section>
      </div>
    </div>
  );
}
