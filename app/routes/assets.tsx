import { useState } from "react";

import { PageHeader } from "~/components/ui/page-header";
import { SurfaceCard } from "~/components/ui/surface-card";
import type { Route } from "./+types/assets";
import { loadAssetsPageData } from "~/lib/site-data.server";

type AssetFact = {
  label: string;
  value: string;
};

function AssetFactList({
  className,
  facts,
  variant = "default",
}: {
  className?: string;
  facts: AssetFact[];
  variant?: "default" | "showcase";
}) {
  return (
    <dl className={className ? `asset-card__tour-facts ${className}` : "asset-card__tour-facts"}>
      {facts.map((fact, index) => (
        <div
          className={[
            "asset-card__tour-fact",
            variant === "showcase" && facts.length % 2 !== 0 && index === facts.length - 1
              ? "asset-card__tour-fact--span"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
          key={fact.label}
        >
          <dt>{fact.label}</dt>
          <dd>{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function AssetOverlayTitle({
  level = "h2",
  title,
  variant = "default",
}: {
  level?: "h2" | "h3";
  title: string;
  variant?: "default" | "showcase";
}) {
  const HeadingTag = level;
  const overlayTitleClassName = [
    "asset-card__overlay-title",
    variant === "showcase" ? "asset-card__overlay-title--showcase" : "",
    title.length > 18 ? "asset-card__overlay-title--long" : "",
    title.length > 24 ? "asset-card__overlay-title--xlong" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <HeadingTag className={overlayTitleClassName}>
      <span>{title}</span>
    </HeadingTag>
  );
}

export const meta: Route.MetaFunction = () => [
  { title: "Vehicle Fleet | Asingan Fire Station" },
  {
    name: "description",
    content: "A public look at the vehicle fleet currently shown for Asingan Fire Station.",
  },
];

export async function loader() {
  return loadAssetsPageData();
}

export default function Assets({ loaderData }: Route.ComponentProps) {
  const { assets, typeCounts } = loaderData;
  const [assetFlipState, setAssetFlipState] = useState<{
    activeAssetId: string | null;
    turnsByAssetId: Record<string, number>;
  }>({
    activeAssetId: null,
    turnsByAssetId: {},
  });
  const totalVehicles = assets.length;
  const totalVehiclesLabel = `${totalVehicles} vehicle${totalVehicles === 1 ? "" : "s"}`;
  const fleetMixLabel = typeCounts
    .map((typeCount) => `${typeCount.count} ${typeCount.label.toLowerCase()}${typeCount.count === 1 ? "" : "s"}`)
    .join(", ");

  function toggleAssetCard(assetId: string) {
    setAssetFlipState((currentState) => {
      const turnsByAssetId = { ...currentState.turnsByAssetId };
      const currentTurns = turnsByAssetId[assetId] ?? 0;
      turnsByAssetId[assetId] = currentTurns + 1;

      if (currentState.activeAssetId && currentState.activeAssetId !== assetId) {
        const previousActiveTurns = turnsByAssetId[currentState.activeAssetId] ?? 0;

        if (previousActiveTurns % 2 !== 0) {
          turnsByAssetId[currentState.activeAssetId] = previousActiveTurns + 1;
        }
      }

      return {
        activeAssetId: currentState.activeAssetId === assetId ? null : assetId,
        turnsByAssetId,
      };
    });
  }

  function handleAssetCardKeyDown(event: React.KeyboardEvent<HTMLDivElement>, assetId: string) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleAssetCard(assetId);
    }
  }

  return (
    <div className="page">
      <div className="page__container">
        <PageHeader
          eyebrow="Vehicle fleet"
          lede="This page focuses only on the station vehicles currently shown in the public fleet record."
          title="The station vehicle fleet, at a glance."
        />

        <section className="asset-overview-grid">
          <SurfaceCard as="article" className="asset-overview-card asset-overview-card--fleet" variant="spotlight">
            <p className="eyebrow">Vehicle fleet overview</p>
            <h2 className="asset-overview-card__title">{totalVehiclesLabel} are currently shown on this page.</h2>
            <p className="asset-overview-card__copy">
              This section now stays focused on the station's vehicle lineup, with each card centered on the vehicle
              itself rather than a separate featured highlight.
            </p>
            <div className="badge-row">
              <span className="status-pill status-pill--neutral">Total vehicles: {totalVehicles}</span>
              {typeCounts.map((typeCount) => (
                <span className="status-pill status-pill--neutral" key={typeCount.label}>
                  {typeCount.label}: {typeCount.count}
                </span>
              ))}
            </div>
            <p className="asset-overview-card__copy">
              The current fleet mix shown here includes {fleetMixLabel}. Flip any vehicle card below to view
              acquisition details, capacity, plate information, and station context when those details are available.
            </p>
          </SurfaceCard>
        </section>

        <section className="asset-grid asset-grid--page">
          {assets.map((asset) => {
            const flipTurns = assetFlipState.turnsByAssetId[asset.id] ?? 0;
            const isFlipped = flipTurns % 2 !== 0;
            const flipTransform = `rotateY(${flipTurns * 180}deg)`;

            return (
              <article className={`asset-card asset-card--page${isFlipped ? " is-flipped" : ""}`} key={asset.id}>
                <div
                  aria-label={`${asset.name}. ${isFlipped ? "Show front of card" : "Show asset details"}`}
                  aria-pressed={isFlipped}
                  className="asset-flip-card"
                  onClick={() => toggleAssetCard(asset.id)}
                  onKeyDown={(event) => handleAssetCardKeyDown(event, asset.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="asset-flip-card__inner" style={{ transform: flipTransform }}>
                    <div className="asset-flip-card__side asset-flip-card__side--front">
                      <div className="asset-card__visual">
                        <div className="media-frame media-frame--landscape media-frame--asset-card asset-card__frame asset-card__frame--page asset-card__media">
                          {asset.image ? (
                            <img
                              className="media-frame__image media-frame__image--contain media-frame__image--asset asset-card__image"
                              src={asset.image}
                              alt={asset.name}
                            />
                          ) : (
                            <div className="media-frame__placeholder">Image unavailable</div>
                          )}
                        </div>
                        <div className="asset-card__overlay">
                          <p className="asset-card__type-badge">{asset.type}</p>
                          <AssetOverlayTitle title={asset.name} />
                        </div>
                      </div>
                      <div className="asset-card__body asset-card__body--page asset-card__body--front">
                        {asset.description ? <p className="asset-card__description">{asset.description}</p> : null}
                        <p className="asset-card__flip-hint">Tap or click to view details</p>
                      </div>
                    </div>
                    <div className="asset-flip-card__side asset-flip-card__side--back">
                      <div className="asset-card__back">
                        <p className="asset-card__back-type">{asset.type}</p>
                        <h3 className="asset-card__back-title">{asset.name}</h3>
                        <AssetFactList
                          className="asset-card__tour-facts--back"
                          facts={[
                            { label: "Acquired", value: asset.dateAcquiredDisplay ?? "Not publicly listed" },
                            { label: "Capacity", value: asset.capacityDisplay ?? "Not listed" },
                            { label: "Plate number", value: asset.plateDisplay ?? "Not publicly listed" },
                            { label: "Station head", value: asset.stationHeadAtAcquisition ?? "Not publicly listed" },
                            { label: "Mayor", value: asset.mayorAtAcquisition ?? "Not publicly listed" },
                          ]}
                        />

                        {asset.engineNumber || asset.chassisNumber ? (
                          <p className="asset-card__serials asset-card__serials--back">
                            {asset.engineNumber ? `Engine: ${asset.engineNumber}` : "Engine: Not listed"}
                            {" · "}
                            {asset.chassisNumber ? `Chassis: ${asset.chassisNumber}` : "Chassis: Not listed"}
                          </p>
                        ) : null}

                        <p className="asset-card__flip-hint asset-card__flip-hint--back">Tap or click to return</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
