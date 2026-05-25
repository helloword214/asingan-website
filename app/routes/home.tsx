import type { CSSProperties } from "react";
import { Link } from "react-router";

import { SectionHeading } from "~/components/ui/section-heading";
import { SurfaceCard } from "~/components/ui/surface-card";
import type { Route } from "./+types/home";
import { loadHomePageData } from "~/lib/site-data.server";

export const meta: Route.MetaFunction = () => [
  { title: "Home | Asingan Fire Station" },
  {
    name: "description",
    content:
      "Community-focused fire protection, preparedness, and public safety information for Asingan Fire Station.",
  },
];

export async function loader() {
  return loadHomePageData();
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const {
    homeImages,
    missionVision,
    missionVisionPosters,
    serviceHighlights,
    stats,
  } = loaderData;
  const [
    ,
    roadCorridorImage,
    stationFrontageImage,
    stationExteriorImage,
    vehicleLineupImage,
    facadeImage,
  ] = homeImages;
  const heroPrimaryImage = stationFrontageImage ?? vehicleLineupImage ?? homeImages[0] ?? null;
  const stationStackImages = [stationExteriorImage, facadeImage].filter(
    (image): image is NonNullable<typeof homeImages[number]> => Boolean(image),
  );
  const heroResponsiveGalleryImages = [
    vehicleLineupImage,
    stationExteriorImage,
    heroPrimaryImage,
    facadeImage,
    roadCorridorImage,
  ]
    .filter((image): image is NonNullable<typeof homeImages[number]> => Boolean(image))
    .filter((image, index, images) => {
      return images.findIndex((candidate) => candidate.src === image.src) === index;
    })
    .slice(0, 3);
  const heroPanelStyle = heroPrimaryImage
    ? ({ "--hero-image": `url("${heroPrimaryImage.src}")` } as CSSProperties)
    : undefined;

  return (
    <div className="page">
      <div className="page__container">
        <section className="hero-panel surface-card" style={heroPanelStyle}>
          <div className="hero-panel__copy">
            <p className="eyebrow">Asingan Fire Station</p>
            <h1>Working Together for a Safer Asingan</h1>
            <p className="lede">
              From emergency response and fire suppression to prevention and community
              preparedness, Asingan Fire Station continues to serve and support the safety of the
              municipality through dedicated public service.
            </p>
            <div className="button-row">
              <Link className="button button--primary" to="/services">
                Explore services
              </Link>
              <Link className="button button--secondary" to="/assets">
                View apparatus
              </Link>
            </div>
          </div>
          {heroResponsiveGalleryImages.length > 0 ? (
            <div className="hero-panel__mobile-gallery" aria-hidden="true">
              {heroResponsiveGalleryImages.map((image, index) => (
                <figure
                  className={`hero-panel__mobile-card${
                    index === 0 ? " hero-panel__mobile-card--feature" : ""
                  }`}
                  key={image.src}
                >
                  <img
                    className="hero-panel__mobile-card-image"
                    src={image.src}
                    alt=""
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </figure>
              ))}
            </div>
          ) : null}
          <div className="stat-grid stat-grid--home hero-panel__stats">
            {stats.map((stat) => (
              <article className="stat-card stat-card--home" key={stat.label}>
                <p className="stat-card__value">{stat.value}</p>
                <h2 className="stat-card__label">{stat.label}</h2>
                <p className="stat-card__detail">{stat.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-grid">
          <SurfaceCard as="article" variant="home">
            <SectionHeading
              eyebrow="Mission and vision"
              title="Shared purpose behind station service."
            />
            <div className="mission-grid mission-grid--home">
              <article className="mission-block">
                <p className="mission-block__label">Mission</p>
                <p className="mission-block__text">{missionVision.mission}</p>
              </article>
              <article className="mission-block mission-block--vision">
                <p className="mission-block__label">Vision</p>
                <p className="mission-block__text">{missionVision.vision}</p>
              </article>
            </div>
            <p className="mission-block__note">
              Together, these statements guide how the station protects lives, strengthens
              preparedness, and serves the community.
            </p>
            <div className="poster-grid">
              {missionVisionPosters.map((poster) => (
                <figure className="poster-card" key={poster.title}>
                  <div className="media-frame media-frame--poster">
                    <img
                      className="media-frame__image media-frame__image--cover"
                      src={poster.src}
                      alt={poster.alt}
                      loading="lazy"
                    />
                  </div>
                </figure>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard as="article" variant="home">
            <SectionHeading
              eyebrow="Services"
              title="Public guides and online access are now in one place."
            />
            <p className="charter-section__note">
              Citizen Charter references and the official FSIS portal are grouped on the
              Services page so the home page stays focused on station overview and identity.
            </p>
            <div className="service-grid">
              {serviceHighlights.slice(0, 4).map((service, index) => (
                <article className="service-card" key={service.title}>
                  <p className="service-card__eyebrow">
                    Service {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
            <div className="button-row">
              <Link className="button button--primary" to="/services">
                Open services page
              </Link>
              <Link className="button button--secondary" to="/history">
                Read station history
              </Link>
            </div>
          </SurfaceCard>
        </section>

        <SurfaceCard className="station-showcase" variant="home">
          <div className="station-showcase__lead">
            <SectionHeading
              eyebrow="Station grounds"
              title="See the spaces that support response, readiness, and public service."
            />
            <p className="station-showcase__copy">
              These views bring the station closer to the reader and highlight the place behind
              daily response, prevention, and community support.
            </p>
          </div>

          <div className="station-showcase__grid">
            {vehicleLineupImage ? (
              <figure className="station-showcase__feature">
                <img
                  className="station-showcase__image station-showcase__image--feature"
                  src={vehicleLineupImage.src}
                  alt={vehicleLineupImage.alt}
                  loading="lazy"
                />
                <figcaption className="station-showcase__caption">{vehicleLineupImage.title}</figcaption>
              </figure>
            ) : null}

            <div className="station-showcase__stack">
              {stationStackImages.map((image) => (
                <figure className="station-showcase__stack-item" key={image.src}>
                  <img
                    className="station-showcase__image"
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                  />
                  <figcaption className="station-showcase__caption">{image.title}</figcaption>
                </figure>
              ))}
            </div>

            {roadCorridorImage ? (
              <figure className="station-showcase__context">
                <img
                  className="station-showcase__image station-showcase__image--context"
                  src={roadCorridorImage.src}
                  alt={roadCorridorImage.alt}
                  loading="lazy"
                />
                <figcaption className="station-showcase__context-body">
                  <p className="station-showcase__caption">{roadCorridorImage.title}</p>
                  <p className="station-showcase__context-note">
                    The station remains connected to the municipal center and close to the
                    communities it serves.
                  </p>
                </figcaption>
              </figure>
            ) : null}
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
