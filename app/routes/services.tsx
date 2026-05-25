import { PageHeader } from "~/components/ui/page-header";
import { SectionHeading } from "~/components/ui/section-heading";
import { SurfaceCard } from "~/components/ui/surface-card";
import { loadHomePageData } from "~/lib/site-data.server";
import type { Route } from "./+types/services";

export const meta: Route.MetaFunction = () => [
  { title: "Services | Asingan Fire Station" },
  {
    name: "description",
    content:
      "Citizen Charter guides, service highlights, and official FSIS online access for Asingan Fire Station.",
  },
];

export async function loader() {
  return loadHomePageData();
}

export default function Services({ loaderData }: Route.ComponentProps) {
  const { citizenCharterFlowcharts, serviceHighlights } = loaderData;
  const fsisOnlineGuideImage = "/images/bfp-info/fsis-online-applicaton.png";
  const fsisPortalUrl = "https://fsis.e-bfp.com/";

  return (
    <div className="page">
      <div className="page__container">
        <PageHeader
          eyebrow="Services"
          lede="This page gathers the public guidance and online access points currently available in the project for Asingan Fire Station."
          title="Public service guides and online access in one place."
        />

        <section className="services-overview">
          <SurfaceCard className="fsis-spotlight fsis-spotlight--priority" variant="spotlight">
            <div className="fsis-spotlight__content">
              <SectionHeading
                eyebrow="FSIS online system"
                title="Continue fire safety applications through the official FSIS portal."
              />
              <p className="fsis-spotlight__copy">
                Applicants can use the Fire Safety Inspection System to register, prepare
                requirements, submit transactions, and monitor updates online through the official
                Bureau of Fire Protection platform.
              </p>
            </div>

            <figure className="fsis-spotlight__media">
              <div className="media-frame media-frame--fsis">
                <img
                  className="media-frame__image media-frame__image--contain fsis-spotlight__image"
                  src={fsisOnlineGuideImage}
                  alt="FSIS Fire Safety Inspection System online application guide poster"
                  loading="lazy"
                />
              </div>
              <div className="button-row fsis-spotlight__actions">
                <a
                  className="button button--primary"
                  href={fsisPortalUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open FSIS portal
                </a>
              </div>
            </figure>
          </SurfaceCard>

          <SurfaceCard className="services-summary">
            <SectionHeading
              eyebrow="Service scope"
              title="Public safety work that supports the municipality."
            />
            <p className="charter-section__note">
              These service highlights summarize the station support areas already reflected in the
              current project materials.
            </p>
            <div className="service-grid">
              {serviceHighlights.map((service) => (
                <article className="service-card" key={service.title}>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </SurfaceCard>
        </section>

        <SurfaceCard as="article">
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
      </div>
    </div>
  );
}
