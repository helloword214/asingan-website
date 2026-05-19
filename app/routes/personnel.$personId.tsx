import { Link } from "react-router";

import { PageHeader } from "~/components/ui/page-header";
import { SurfaceCard } from "~/components/ui/surface-card";
import type { Route } from "./+types/personnel.$personId";
import { loadPersonnelProfilePageData } from "~/lib/site-data.server";

export const meta: Route.MetaFunction = ({ data }) => [
  {
    title: data ? `${data.person.displayName} | Personnel | Asingan Fire Station` : "Personnel Profile | Asingan Fire Station",
  },
  {
    name: "description",
    content: data
      ? `Personnel profile for ${data.person.displayName} of Asingan Fire Station.`
      : "Personnel profile of Asingan Fire Station.",
  },
];

export async function loader({ params }: Route.LoaderArgs) {
  const personId = params.personId;

  if (!personId) {
    throw new Response("Not Found", { status: 404 });
  }

  const profileData = await loadPersonnelProfilePageData(personId);

  if (!profileData) {
    throw new Response("Not Found", { status: 404 });
  }

  return profileData;
}

export default function PersonnelProfile({ loaderData }: Route.ComponentProps) {
  const { person } = loaderData;
  const profileFacts = [
    {
      label: "Highest training",
      value: person.mandatoryTraining ?? "Not listed",
    },
    {
      label: "Eligibility",
      value: person.eligibility ?? "Not listed",
    },
    {
      label: "Educational attainment",
      value: person.educationalAttainment ?? "Not listed",
    },
    {
      label: "Years in service",
      value: person.lengthOfServiceDisplay ?? "Not listed",
    },
  ];

  return (
    <div className="page">
      <div className="page__container">
        <PageHeader
          actions={
            <Link className="panel-link" to="/personnel">
              Back to personnel directory
            </Link>
          }
          eyebrow="Personnel profile"
          lede="Basic public profile details and recorded station assignments where available."
          title={person.displayName}
        />

        <SurfaceCard variant="spotlight">
          <div className="profile-hero">
            <div className="media-frame media-frame--portrait media-frame--profile">
              {person.photo ? (
                <img
                  className="media-frame__image media-frame__image--contain"
                  src={person.photo}
                  alt={person.displayName}
                />
              ) : (
                <div className="media-frame__placeholder">Photo unavailable</div>
              )}
            </div>

            <div className="profile-hero__body">
              <div>
                <p className="person-card__rank">{person.rank ?? "Personnel"}</p>
                <h2>{person.displayName}</h2>
              </div>

              <div className="badge-row">
                {person.leadershipRoleTitles.length > 0 ? (
                  <span className="status-pill status-pill--confirmed">Leadership role shown</span>
                ) : null}
                {person.currentDesignations.length > 0 ? (
                  <span className="status-pill status-pill--neutral">Current designations listed</span>
                ) : null}
                {person.currentStationLabel ? (
                  <span className="status-pill status-pill--neutral">{person.currentStationLabel}</span>
                ) : null}
              </div>

              <dl className="person-card__facts person-card__facts--profile">
                {profileFacts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard as="section">
          <p className="eyebrow">Current assignment</p>

          {person.leadershipRoleTitles.length > 0 ? (
            <>
              <p className="person-card__section-label">Leadership and unit roles</p>
              <div className="badge-row">
                {person.leadershipRoleTitles.map((role) => (
                  <span className="status-pill status-pill--confirmed" key={role}>
                    {role}
                  </span>
                ))}
              </div>
            </>
          ) : null}

          {person.currentDesignations.length > 0 ? (
            <>
              <p className="person-card__section-label">Current designations</p>
              <div className="badge-row">
                {person.currentDesignations.map((designation) => (
                  <span className="status-pill status-pill--neutral" key={designation}>
                    {designation}
                  </span>
                ))}
              </div>
            </>
          ) : null}

          {person.leadershipRoleTitles.length === 0 && person.currentDesignations.length === 0 ? (
            <p className="person-card__note">No current leadership or designation detail is shown in this view.</p>
          ) : null}
        </SurfaceCard>

        <SurfaceCard>
          <p className="eyebrow">Station assignments</p>

          {person.stationAssignments.length > 0 ? (
            <>
              <p className="person-card__section-label">Recorded stations</p>
              <div className="timeline-grid">
                {person.stationAssignments.map((assignment) => (
                  <article className="timeline-preview__item" key={`${assignment.station}-${assignment.years}`}>
                    <p>{assignment.years}</p>
                    <h2>{assignment.station}</h2>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <p className="person-card__note">No recorded station assignment is shown on this profile.</p>
          )}
        </SurfaceCard>
      </div>
    </div>
  );
}
