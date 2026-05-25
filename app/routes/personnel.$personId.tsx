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
  const hasAssignmentDetails =
    person.leadershipRoleTitles.length > 0 || person.currentDesignations.length > 0;
  const profileFacts = [
    person.currentStationLabel
      ? {
          label: "Current station",
          value: person.currentStationLabel,
        }
      : null,
    person.statusOfAppointment
      ? {
          label: "Status of appointment",
          value: person.statusOfAppointment,
        }
      : null,
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
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));

  return (
    <div className="page">
      <div className="page__container">
        <PageHeader
          className="page-header--personnel-profile"
          actions={
            <Link className="panel-link panel-link--back" to="/personnel">
              Back to personnel directory
            </Link>
          }
          eyebrow="Personnel profile"
          lede="Profile details, current assignment, and station service history."
          title={person.displayName}
        />

        <SurfaceCard className="person-profile-card" variant="spotlight">
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
              <div className="person-profile__intro">
                <p className="eyebrow">Service profile</p>
                <h2>Profile summary</h2>
                <p className="person-profile__lead">
                  This page highlights current assignment details and key service information for{" "}
                  {person.displayName}.
                </p>
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

        <SurfaceCard as="section" className="person-profile-section">
          <p className="eyebrow">Current assignment</p>
          {person.currentStationLabel ? (
            <p className="person-profile__meta">Currently serving at {person.currentStationLabel}.</p>
          ) : null}

          {hasAssignmentDetails ? (
            <div className="person-section-grid">
              {person.leadershipRoleTitles.length > 0 ? (
                <article className="service-card person-assignment-card">
                  <p className="person-card__section-label">Leadership and unit roles</p>
                  <div className="badge-row">
                    {person.leadershipRoleTitles.map((role) => (
                      <span className="status-pill status-pill--confirmed" key={role}>
                        {role}
                      </span>
                    ))}
                  </div>
                </article>
              ) : null}

              {person.currentDesignations.length > 0 ? (
                <article className="service-card person-assignment-card">
                  <p className="person-card__section-label">Current designations</p>
                  <div className="badge-row">
                    {person.currentDesignations.map((designation) => (
                      <span className="status-pill status-pill--neutral" key={designation}>
                        {designation}
                      </span>
                    ))}
                  </div>
                </article>
              ) : null}
            </div>
          ) : (
            <p className="person-card__note">
              No current leadership or designation detail is shown in this view.
            </p>
          )}
        </SurfaceCard>

        <SurfaceCard className="person-profile-section">
          <p className="eyebrow">Station assignments</p>

          {person.stationAssignments.length > 0 ? (
            <>
              <p className="person-profile__meta">
                Past and present station assignments shown from the available service record.
              </p>
              <div className="person-station-grid">
                {person.stationAssignments.map((assignment) => (
                  <article
                    className={`person-station-card${assignment.current ? " person-station-card--current" : ""}`}
                    key={`${assignment.station}-${assignment.years}`}
                  >
                    <p className="story-card__date">{assignment.years}</p>
                    <h2>{assignment.station}</h2>
                    {assignment.current ? (
                      <p className="person-station-card__flag">Current station</p>
                    ) : null}
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
