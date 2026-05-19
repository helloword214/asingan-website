import { PageHeader } from "~/components/ui/page-header";
import { SurfaceCard } from "~/components/ui/surface-card";
import type { Route } from "./+types/assets";
import { loadAssetsPageData } from "~/lib/site-data.server";

export const meta: Route.MetaFunction = () => [
  { title: "Assets and Apparatus | Asingan Fire Station" },
  {
    name: "description",
    content: "Vehicles and support assets that help Asingan Fire Station respond, prepare, and serve.",
  },
];

export async function loader() {
  return loadAssetsPageData();
}

export default function Assets({ loaderData }: Route.ComponentProps) {
  const { assets, featuredAsset, notes, typeCounts } = loaderData;

  return (
    <div className="page">
      <div className="page__container">
        <PageHeader
          eyebrow="Assets and apparatus"
          lede="This page highlights the vehicles and support assets that help the station respond, prepare, and serve across Asingan."
          title="Assets that support response and readiness."
        />

        <section className="split-section">
          <SurfaceCard as="article" variant="spotlight">
            <p className="eyebrow">Featured response asset</p>
            {featuredAsset ? (
              <div className="asset-spotlight">
                <div className="media-frame media-frame--landscape media-frame--asset-hero">
                  {featuredAsset.image ? (
                    <img
                      className="media-frame__image media-frame__image--contain media-frame__image--asset"
                      src={featuredAsset.image}
                      alt={featuredAsset.name}
                    />
                  ) : (
                    <div className="media-frame__placeholder">Image unavailable</div>
                  )}
                </div>
                <div className="asset-spotlight__body">
                  <h2>{featuredAsset.name}</h2>
                  <p className="story-card__summary">
                    {featuredAsset.description ??
                      "A long-serving asset remembered as part of the station's response history."}
                  </p>
                  <div className="badge-row">
                    <span className="status-pill status-pill--neutral">{featuredAsset.type}</span>
                  </div>
                  <p className="leader-spotlight__meta">
                    {featuredAsset.dateAcquiredDisplay
                      ? `Acquired ${featuredAsset.dateAcquiredDisplay}`
                      : "Part of the station's response history."}
                  </p>
                </div>
              </div>
            ) : (
              <p className="story-card__summary">A featured apparatus is not shown at the moment.</p>
            )}
          </SurfaceCard>

          <SurfaceCard as="article">
            <p className="eyebrow">Response overview</p>
            <div className="badge-row">
              {typeCounts.map((typeCount) => (
                <span className="status-pill status-pill--neutral" key={typeCount.label}>
                  {typeCount.label}: {typeCount.count}
                </span>
              ))}
            </div>
            <ul className="note-list">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </SurfaceCard>
        </section>

        <section className="asset-grid">
          {assets.map((asset) => (
            <article className="asset-card" key={asset.id}>
              <div className="media-frame media-frame--landscape media-frame--asset-card">
                {asset.image ? (
                  <img
                    className="media-frame__image media-frame__image--contain media-frame__image--asset"
                    src={asset.image}
                    alt={asset.name}
                  />
                ) : (
                  <div className="media-frame__placeholder">Image unavailable</div>
                )}
              </div>
              <div className="asset-card__body">
                <div className="section-heading">
                  <div>
                    <p className="asset-card__type">{asset.type}</p>
                    <h2>{asset.name}</h2>
                  </div>
                </div>

                {asset.description ? <p className="story-card__summary">{asset.description}</p> : null}

                <dl className="asset-card__facts">
                  <div>
                    <dt>Acquired</dt>
                    <dd>{asset.dateAcquiredDisplay ?? "Not publicly listed"}</dd>
                  </div>
                  <div>
                    <dt>Capacity</dt>
                    <dd>{asset.capacityDisplay ?? "Not listed"}</dd>
                  </div>
                  <div>
                    <dt>Plate number</dt>
                    <dd>{asset.plateDisplay ?? "Not publicly listed"}</dd>
                  </div>
                  <div>
                    <dt>Registration</dt>
                    <dd>{asset.registrationStatus ?? "Not listed"}</dd>
                  </div>
                  <div>
                    <dt>Station head</dt>
                    <dd>{asset.stationHeadAtAcquisition ?? "Not publicly listed"}</dd>
                  </div>
                  <div>
                    <dt>Mayor</dt>
                    <dd>{asset.mayorAtAcquisition ?? "Not publicly listed"}</dd>
                  </div>
                </dl>

                {asset.engineNumber || asset.chassisNumber ? (
                  <p className="asset-card__serials">
                    {asset.engineNumber ? `Engine: ${asset.engineNumber}` : "Engine: Not listed"}
                    {" · "}
                    {asset.chassisNumber ? `Chassis: ${asset.chassisNumber}` : "Chassis: Not listed"}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
