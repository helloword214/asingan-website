import { Link } from "react-router";

import { PageHeader } from "~/components/ui/page-header";
import { SectionHeading } from "~/components/ui/section-heading";
import { SurfaceCard } from "~/components/ui/surface-card";
import type { Route } from "./+types/personnel._index";
import { loadPersonnelPageData } from "~/lib/site-data.server";

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

export default function PersonnelIndex({ loaderData }: Route.ComponentProps) {
  const { people } = loaderData;
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
            actions={
              <span className="status-pill status-pill--neutral">
                {sortedPeople.length} personnel
              </span>
            }
            eyebrow="Personnel list"
            title="Browse the personnel serving Asingan Fire Station."
          />

          <ul className="person-list">
            {sortedPeople.map((person) => (
              <li key={person.id}>
                <Link
                  className="person-list__item"
                  to={`/personnel/${person.id}`}
                >
                  <span className="person-list__identity">
                    <span className="media-frame media-frame--square media-frame--person-list">
                      {person.photo ? (
                        <img
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
                    <span className="person-list__name">
                      {person.displayName}
                    </span>
                  </span>
                  <span className="person-list__cta">View profile</span>
                </Link>
              </li>
            ))}
          </ul>
        </SurfaceCard>
      </div>
    </div>
  );
}
