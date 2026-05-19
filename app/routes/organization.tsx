import { useState } from "react";

import { PageHeader } from "~/components/ui/page-header";
import { SectionHeading } from "~/components/ui/section-heading";
import { SurfaceCard } from "~/components/ui/surface-card";
import { loadOrganizationPageData, type OrganizationPageData } from "~/lib/site-data.server";

export const meta = () => [
  { title: "Organization Structure | Asingan Fire Station" },
  {
    name: "description",
    content: "How Asingan Fire Station is structured to support response, preparedness, and public service.",
  },
];

export async function loader() {
  return loadOrganizationPageData();
}

export default function Organization({ loaderData }: { loaderData: OrganizationPageData }) {
  const { currentHead, glossary, groups } = loaderData;
  type OrganizationGroup = (typeof groups)[number];
  type OrganizationUnit = OrganizationGroup["units"][number];
  type SupportRole = OrganizationUnit["supportRoles"][number];
  const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id ?? "");
  const chartGuide = [
    "The chart highlights how station leadership, sections, and units work together.",
    "Section tabs help you focus on one part of the station's service structure at a time.",
    "Supporting roles appear where they help explain teamwork in daily operations.",
  ];

  const activeGroup = groups.find((group) => group.id === activeGroupId) ?? groups[0] ?? null;

  function countFlowBoxes(nodes: OrganizationUnit[]): number {
    return nodes.reduce((total, node) => total + 1 + countFlowBoxes(node.children), 0);
  }

  function SupportRoleBadges({ roles }: { roles: SupportRole[] }) {
    if (roles.length === 0) {
      return null;
    }

    return (
      <>
        <p className="org-node__support-label">Supporting roles</p>
        <div className="badge-row">
          {roles.map((role) => (
            <span className="status-pill status-pill--neutral" key={role.id}>
              {role.title}
              {role.acronym ? ` (${role.acronym})` : ""}
            </span>
          ))}
        </div>
      </>
    );
  }

  function OrgRoleBox({
    title,
    roleTitle,
    personName,
    supportRoles = [],
    showEmptySupportMessage = false,
  }: {
    title: string;
    roleTitle: string;
    personName: string;
    supportRoles?: SupportRole[];
    showEmptySupportMessage?: boolean;
  }) {
    return (
      <article className="org-node">
        <div className="org-node__top">
          <p className="org-node__kicker">{title}</p>
        </div>
        <p className="org-node__role">{roleTitle}</p>
        <h3>{personName}</h3>
        <SupportRoleBadges roles={supportRoles} />
        {showEmptySupportMessage && supportRoles.length === 0 ? (
          <p className="org-node__note">No supporting roles are shown in this view.</p>
        ) : null}
      </article>
    );
  }

  function OrgChartNode({ node }: { node: OrganizationUnit }) {
    return (
      <div className="org-chart-node">
        <OrgRoleBox
          title={node.name}
          roleTitle={node.lead.roleTitle}
          personName={node.lead.assignee?.displayName ?? "Not listed"}
          supportRoles={node.supportRoles}
          showEmptySupportMessage={node.children.length === 0}
        />

        {node.children.length > 0 ? <div className="org-arrow org-arrow--nested" aria-hidden="true" /> : null}

        {node.children.length > 0 ? (
          <div className="org-branch__children org-branch__children--nested">
            {node.children.map((child) => (
              <OrgChartNode key={child.id} node={child} />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__container">
        <PageHeader
          eyebrow="Organization structure"
          lede="This page shows how leadership, sections, and units work together to support response, preparedness, and public service."
          title="How the station works together in service."
        />

        <SurfaceCard variant="chart">
          <SectionHeading
            actions={<span className="status-pill status-pill--neutral">{groups.length} sections</span>}
            eyebrow="Organizational chart"
            title="Sections and units working together for station service."
          />

          <div className="org-tabs" role="tablist" aria-label="Organization sections">
            {groups.map((group) => {
              const isActive = activeGroup?.id === group.id;
              const boxCount = countFlowBoxes(group.units);

              return (
                <button
                  aria-controls={`org-panel-${group.id}`}
                  aria-selected={isActive}
                  className={`org-tab${isActive ? " is-active" : ""}`}
                  id={`org-tab-${group.id}`}
                  key={group.id}
                  onClick={() => setActiveGroupId(group.id)}
                  role="tab"
                  tabIndex={isActive ? 0 : -1}
                  type="button"
                >
                  <span className="org-tab__eyebrow">Section</span>
                  <span className="org-tab__title">{group.name}</span>
                  <span className="org-tab__meta">{boxCount} units and teams in view</span>
                </button>
              );
            })}
          </div>

          {activeGroup ? (
            <>
              <div className="org-focus-bar">
                <div>
                  <p className="org-focus-bar__label">Selected section</p>
                  <h3>{activeGroup.name}</h3>
                </div>
                <div className="org-focus-bar__meta">
                  <span>{countFlowBoxes(activeGroup.units)} units and teams</span>
                </div>
              </div>

              <div
                aria-labelledby={`org-tab-${activeGroup.id}`}
                className="org-chart org-chart--focused"
                id={`org-panel-${activeGroup.id}`}
                role="tabpanel"
              >
                <div className="org-flow-stage org-flow-stage--head">
                  <OrgRoleBox
                    title="Head of Station"
                    roleTitle={currentHead.roleTitle}
                    personName={currentHead.assignee?.displayName ?? "Not listed"}
                  />
                </div>

                <div className="org-arrow" aria-hidden="true" />

                <div className="org-flow-stage org-flow-stage--section">
                  <OrgRoleBox
                    title={activeGroup.name}
                    roleTitle={activeGroup.lead.roleTitle}
                    personName={activeGroup.lead.assignee?.displayName ?? "Not listed"}
                  />
                </div>

                {activeGroup.units.length > 0 ? <div className="org-arrow" aria-hidden="true" /> : null}

                {activeGroup.units.length > 0 ? (
                  <div className="org-flow-grid">
                    {activeGroup.units.map((unit) => (
                      <OrgChartNode key={unit.id} node={unit} />
                    ))}
                  </div>
                ) : (
                  <article className="org-node">
                    <p className="org-node__note">No units are shown for this section.</p>
                  </article>
                )}
              </div>
            </>
          ) : null}
        </SurfaceCard>

        <section className="content-grid">
          <SurfaceCard as="article">
            <p className="eyebrow">Acronym glossary</p>
            <div className="glossary-grid">
              {glossary.map((entry) => (
                <div className="glossary-item" key={entry.acronym}>
                  <h2>{entry.acronym}</h2>
                  <p>{entry.label}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard as="article">
            <p className="eyebrow">How to read the chart</p>
            <ul className="note-list">
              {chartGuide.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </SurfaceCard>
        </section>
      </div>
    </div>
  );
}
