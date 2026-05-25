import { useEffect, useRef, useState, type TouchEvent } from "react";

import { PageHeader } from "~/components/ui/page-header";
import { SectionHeading } from "~/components/ui/section-heading";
import { SurfaceCard } from "~/components/ui/surface-card";
import { loadHomePageData } from "~/lib/site-data.server";
import type { Route } from "./+types/services";

type ServiceImagePreview = {
  actionHref?: string;
  actionLabel?: string;
  alt: string;
  description: string;
  eyebrow: string;
  id: string;
  src: string;
  title: string;
};

const MIN_SERVICE_IMAGE_SCALE = 1;
const MAX_SERVICE_IMAGE_SCALE = 4;

function clampScale(value: number): number {
  return Math.min(MAX_SERVICE_IMAGE_SCALE, Math.max(MIN_SERVICE_IMAGE_SCALE, value));
}

function getTouchDistance(
  firstTouch: { clientX: number; clientY: number },
  secondTouch: { clientX: number; clientY: number },
): number {
  const deltaX = secondTouch.clientX - firstTouch.clientX;
  const deltaY = secondTouch.clientY - firstTouch.clientY;
  return Math.hypot(deltaX, deltaY);
}

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
  const imagePreviews: ServiceImagePreview[] = [
    {
      actionHref: fsisPortalUrl,
      actionLabel: "Open FSIS portal",
      alt: "FSIS Fire Safety Inspection System online application guide poster",
      description:
        "Applicants can use the Fire Safety Inspection System to register, prepare requirements, submit transactions, and monitor updates online through the official Bureau of Fire Protection platform.",
      eyebrow: "FSIS online system",
      id: "fsis-online-guide",
      src: fsisOnlineGuideImage,
      title: "FSIS online application guide",
    },
    ...citizenCharterFlowcharts.map((flowchart, index) => ({
      alt: flowchart.alt,
      description: flowchart.description,
      eyebrow: `Citizen charter ${String(index + 1).padStart(2, "0")}`,
      id: `citizen-charter-${index + 1}`,
      src: flowchart.src,
      title: flowchart.title,
    })),
  ];
  const [openImageId, setOpenImageId] = useState<string | null>(null);
  const [imageZoomScale, setImageZoomScale] = useState(MIN_SERVICE_IMAGE_SCALE);
  const activeImage = imagePreviews.find((image) => image.id === openImageId) ?? null;
  const serviceImageFrameRef = useRef<HTMLDivElement | null>(null);
  const imageZoomScaleRef = useRef(MIN_SERVICE_IMAGE_SCALE);
  const pinchGestureRef = useRef({
    initialDistance: 0,
    initialScale: MIN_SERVICE_IMAGE_SCALE,
  });

  useEffect(() => {
    imageZoomScaleRef.current = imageZoomScale;
  }, [imageZoomScale]);

  useEffect(() => {
    if (openImageId === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [openImageId]);

  useEffect(() => {
    if (openImageId === null) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenImageId(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openImageId]);

  useEffect(() => {
    if (!activeImage) {
      return;
    }

    pinchGestureRef.current = {
      initialDistance: 0,
      initialScale: MIN_SERVICE_IMAGE_SCALE,
    };
    setImageZoomScale(MIN_SERVICE_IMAGE_SCALE);

    requestAnimationFrame(() => {
      const frame = serviceImageFrameRef.current;

      if (!frame) {
        return;
      }

      frame.scrollLeft = 0;
      frame.scrollTop = 0;
    });
  }, [activeImage?.id]);

  function applyImageScale(nextScale: number) {
    const frame = serviceImageFrameRef.current;
    const currentScale = imageZoomScaleRef.current;
    const clampedScale = clampScale(nextScale);

    if (!frame) {
      setImageZoomScale(clampedScale);
      return;
    }

    const focusX = (frame.scrollLeft + frame.clientWidth / 2) / currentScale;
    const focusY = (frame.scrollTop + frame.clientHeight / 2) / currentScale;

    setImageZoomScale(clampedScale);

    requestAnimationFrame(() => {
      const maxScrollLeft = Math.max(0, frame.scrollWidth - frame.clientWidth);
      const maxScrollTop = Math.max(0, frame.scrollHeight - frame.clientHeight);
      const nextScrollLeft = focusX * clampedScale - frame.clientWidth / 2;
      const nextScrollTop = focusY * clampedScale - frame.clientHeight / 2;

      frame.scrollLeft = Math.min(maxScrollLeft, Math.max(0, nextScrollLeft));
      frame.scrollTop = Math.min(maxScrollTop, Math.max(0, nextScrollTop));
    });
  }

  function resetImageZoom() {
    pinchGestureRef.current = {
      initialDistance: 0,
      initialScale: MIN_SERVICE_IMAGE_SCALE,
    };
    setImageZoomScale(MIN_SERVICE_IMAGE_SCALE);

    requestAnimationFrame(() => {
      const frame = serviceImageFrameRef.current;

      if (!frame) {
        return;
      }

      frame.scrollLeft = 0;
      frame.scrollTop = 0;
    });
  }

  function closeImageModal() {
    resetImageZoom();
    setOpenImageId(null);
  }

  function handleImageTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (event.touches.length !== 2) {
      return;
    }

    pinchGestureRef.current = {
      initialDistance: getTouchDistance(event.touches[0], event.touches[1]),
      initialScale: imageZoomScaleRef.current,
    };
  }

  function handleImageTouchMove(event: TouchEvent<HTMLDivElement>) {
    if (event.touches.length !== 2) {
      return;
    }

    const initialDistance = pinchGestureRef.current.initialDistance;

    if (initialDistance <= 0) {
      return;
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    const nextDistance = getTouchDistance(event.touches[0], event.touches[1]);
    const nextScale = pinchGestureRef.current.initialScale * (nextDistance / initialDistance);
    applyImageScale(nextScale);
  }

  function handleImageTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (event.touches.length >= 2) {
      pinchGestureRef.current = {
        initialDistance: getTouchDistance(event.touches[0], event.touches[1]),
        initialScale: imageZoomScaleRef.current,
      };
      return;
    }

    pinchGestureRef.current = {
      initialDistance: 0,
      initialScale: imageZoomScaleRef.current,
    };
  }

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
              <button
                aria-label="Open larger view of the FSIS online application guide"
                className="service-media-trigger fsis-spotlight__trigger"
                onClick={() => setOpenImageId("fsis-online-guide")}
                type="button"
              >
                <div className="media-frame media-frame--fsis">
                  <img
                    className="media-frame__image media-frame__image--contain fsis-spotlight__image"
                    src={fsisOnlineGuideImage}
                    alt="FSIS Fire Safety Inspection System online application guide poster"
                    loading="lazy"
                  />
                </div>
              </button>
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
                  <button
                    aria-label={`Open larger view of ${flowchart.title}`}
                    className="service-media-trigger charter-card__trigger"
                    onClick={() => setOpenImageId(`citizen-charter-${index + 1}`)}
                    type="button"
                  >
                    <img
                      className="charter-card__image"
                      src={flowchart.src}
                      alt={flowchart.alt}
                      loading="lazy"
                    />
                    <span className="charter-card__caption">
                      <span className="charter-card__index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{flowchart.title}</span>
                    </span>
                  </button>
                </figure>
              ))}
            </div>
          </div>
        </SurfaceCard>

        {activeImage ? (
          <div
            aria-labelledby="services-image-modal-title"
            aria-modal="true"
            className="leadership-modal service-image-modal"
            role="dialog"
          >
            <button
              aria-label="Close service image modal"
              className="leadership-modal__backdrop"
              onClick={closeImageModal}
              type="button"
            />

            <div className="leadership-modal__sheet service-image-modal__sheet">
              <div className="leadership-modal__header">
                <div className="leadership-modal__header-copy">
                  <p className="leadership-modal__eyebrow">{activeImage.eyebrow}</p>
                  <p className="leadership-modal__hint">Tap outside the modal to close.</p>
                </div>
                <button
                  aria-label="Close service image modal"
                  className="leadership-modal__close"
                  onClick={closeImageModal}
                  type="button"
                >
                  Close
                </button>
              </div>

              <div className="service-image-modal__content">
                <div
                  className={`media-frame service-image-modal__frame${
                    imageZoomScale > MIN_SERVICE_IMAGE_SCALE ? " is-zoomed" : ""
                  }`}
                  onTouchEnd={handleImageTouchEnd}
                  onTouchMove={handleImageTouchMove}
                  onTouchStart={handleImageTouchStart}
                  ref={serviceImageFrameRef}
                >
                  <div
                    className="service-image-modal__zoom-layer"
                    style={{ width: `${imageZoomScale * 100}%` }}
                  >
                    <img
                      className="media-frame__image media-frame__image--contain service-image-modal__image"
                      src={activeImage.src}
                      alt={activeImage.alt}
                    />
                  </div>
                </div>

                <div className="service-image-modal__body">
                  <h2 id="services-image-modal-title">{activeImage.title}</h2>
                  <p className="service-image-modal__note">{activeImage.description}</p>
                  <p className="service-image-modal__zoom-hint">
                    Pinch to zoom on mobile. Drag the enlarged image to inspect details.
                  </p>
                  {activeImage.actionHref && activeImage.actionLabel ? (
                    <div className="button-row service-image-modal__actions">
                      <a
                        className="button button--primary"
                        href={activeImage.actionHref}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {activeImage.actionLabel}
                      </a>
                      {imageZoomScale > MIN_SERVICE_IMAGE_SCALE ? (
                        <button
                          className="button button--secondary"
                          onClick={resetImageZoom}
                          type="button"
                        >
                          Reset zoom
                        </button>
                      ) : null}
                    </div>
                  ) : imageZoomScale > MIN_SERVICE_IMAGE_SCALE ? (
                    <div className="button-row service-image-modal__actions">
                      <button
                        className="button button--secondary"
                        onClick={resetImageZoom}
                        type="button"
                      >
                        Reset zoom
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
