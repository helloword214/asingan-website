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
    citizenCharterFlowcharts,
    homeImages,
    missionVision,
    missionVisionPosters,
    stats,
  } = loaderData;
  const [
    municipalCenterImage,
    roadCorridorImage,
    stationFrontageImage,
    stationExteriorImage,
    vehicleLineupImage,
    facadeImage,
  ] = homeImages;
  const heroPrimaryImage = stationFrontageImage ?? vehicleLineupImage ?? homeImages[0] ?? null;
  const heroSupportImages = [vehicleLineupImage, municipalCenterImage]
    .filter((image): image is NonNullable<typeof homeImages[number]> => Boolean(image))
    .slice(0, 2);
  const stationStackImages = [stationExteriorImage, facadeImage].filter(
    (image): image is NonNullable<typeof homeImages[number]> => Boolean(image),
  );

  return (
    <div className="page">
      <div className="page__container">
        <section className="hero-panel surface-card">
          <div className="hero-panel__copy">
            <p className="eyebrow">Asingan Fire Station</p>
            <h1>Working Together for a Safer Asingan</h1>
            <p className="lede">
              From emergency response and fire suppression to prevention and community
              preparedness, Asingan Fire Station continues to serve and support the safety of the
              municipality through dedicated public service.
            </p>
            <div className="button-row">
              <Link className="button button--primary" to="/assets">
                View apparatus
              </Link>
              <Link className="button button--secondary" to="/history">
                Read station history
              </Link>
            </div>
          </div>
          <div className="hero-panel__media">
            {heroPrimaryImage ? (
              <>
                <div className="hero-mosaic hero-mosaic--home" aria-label="Station and municipal views">
                  <img src={heroPrimaryImage.src} alt={heroPrimaryImage.alt} />
                  {heroSupportImages.map((image) => (
                    <img key={image.src} src={image.src} alt={image.alt} />
                  ))}
                </div>
                <p className="hero-panel__media-note">
                  Station frontage, response vehicles, and municipal context at a glance.
                </p>
              </>
            ) : null}
          </div>
        </section>

        <section className="stat-grid stat-grid--home">
          {stats.map((stat) => (
            <article className="stat-card stat-card--home" key={stat.label}>
              <p className="stat-card__value">{stat.value}</p>
              <h2 className="stat-card__label">{stat.label}</h2>
              <p className="stat-card__detail">{stat.detail}</p>
            </article>
          ))}
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
              eyebrow="Citizen charter"
              title="Public guides that support safer homes, buildings, and businesses."
            />
            <p className="charter-section__note">
              Step-by-step references that help residents and establishments prepare the
              requirements for key fire safety transactions.
            </p>
            <div className="charter-section charter-section--standalone">
              <div className="charter-grid">
                {citizenCharterFlowcharts.map((flowchart, index) => (
                  <figure className="charter-card" key={flowchart.title}>
                    <img
                      className="charter-card__image"
                      src={flowchart.src}
                      alt={flowchart.alt}
                      loading="lazy"
                    />
                    <figcaption className="charter-card__caption">
                      <span className="charter-card__index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{flowchart.title}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
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
