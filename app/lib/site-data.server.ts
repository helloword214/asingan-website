import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

interface RoleSlot {
  id: string;
  title: string;
  acronym?: string;
}

interface OrgNode {
  id: string;
  name: string;
  type: string;
  leadRoleId?: string;
  leadTitle?: string;
  structureSource?: string;
  sourceNote?: string;
  roles?: RoleSlot[];
  children?: OrgNode[];
}

interface AcronymEntry {
  acronym: string;
  label: string;
}

interface OrganizationStructureFile {
  stationHeadRole: {
    roleId: string;
    title: string;
  };
  groups: OrgNode[];
  acronymGlossary: AcronymEntry[];
  termNotes: string[];
  notes: string[];
}

interface AssignmentRecord {
  roleId: string;
  personnelId: string;
  assignmentStatus: string;
  effectiveStartIso?: string;
}

interface UnresolvedAssignment {
  roleId: string;
  candidatePersonnelIds: string[];
  reason: string;
}

interface AssignmentFile {
  notes: string[];
  currentAssignments: AssignmentRecord[];
  unresolvedAssignments: UnresolvedAssignment[];
}

interface PersonnelRecord {
  id: string;
  rank?: string | null;
  displayName: string;
  photo?: string | null;
  designations?: string[];
  designationAuthority?: string | null;
  educationalAttainment?: string | null;
  eligibility?: string | null;
  mandatoryTraining?: string | null;
  statusOfAppointment?: string | null;
  dateEnteredServiceIso?: string | null;
  dateRetirementIso?: string | null;
  lengthOfServiceDisplay?: string | null;
  sex?: string | null;
  notes?: string[];
}

interface PersonnelFile {
  records: PersonnelRecord[];
}

interface FireMarshalTimelineEntry {
  id: string;
  rank?: string | null;
  displayName: string;
  termStartDisplay: string;
  termEndDisplay: string;
  termStartIso?: string | null;
  termEndIso?: string | null;
  status: string;
  image?: string | null;
  notes?: string[];
}

interface StationSeen {
  station: string;
  firstSeenStartIso?: string | null;
  lastSeenEndIso?: string | null;
  current: boolean;
}

interface DesignationHistory {
  label: string;
  firstSeenStartIso?: string | null;
  lastSeenEndIso?: string | null;
  current: boolean;
}

interface ServicePeriodRecord {
  inclusiveDatesDisplay: string;
  startIso?: string | null;
  endIso?: string | null;
  isPresent: boolean;
  station: string;
  isAsinganRelated: boolean;
  authorityRef?: string | null;
  confirmedDesignationLabels: string[];
  designationLabelsNeedingVerification?: string[];
  sourceNote?: string;
}

interface ServiceHistoryRecord {
  personnelId: string;
  notes?: string[];
  coverageSummary?: {
    firstRecordedPeriodStartIso?: string | null;
    latestRecordedPeriodStartIso?: string | null;
    hasPresentAssignment?: boolean;
    stationsSeen?: StationSeen[];
  };
  servicePeriods?: ServicePeriodRecord[];
  confirmedDesignationHistory?: DesignationHistory[];
  designationHistoryNeedingVerification?: DesignationHistory[];
}

interface ServiceHistoryFile {
  records: ServiceHistoryRecord[];
}

interface HistoryEventRecord {
  id: string;
  title: string;
  dateDisplay: string;
  dateIso?: string | null;
  type: string;
  summary: string;
  sourceLabel: string;
  sourceUrl?: string | null;
  sourceStatus: string;
  notes: string[];
}

interface VehicleAssetRecord {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  capacityDisplay?: string | null;
  capacityGallons?: number | null;
  plateNumber?: string | null;
  plateDisplay?: string | null;
  dateAcquiredDisplay?: string | null;
  dateAcquiredIso?: string | null;
  registrationStatus?: string | null;
  engineNumber?: string | null;
  chassisNumber?: string | null;
  stationHeadAtAcquisition?: string | null;
  mayorAtAcquisition?: string | null;
  image?: string | null;
  sourceDocument?: string | null;
  notes: string[];
}

export interface StatItem {
  value: string;
  label: string;
  detail: string;
}

export interface PersonSummary {
  id: string;
  displayName: string;
  rank: string | null;
  photo: string | null;
  currentDesignations: string[];
  leadershipRoleTitles: string[];
  educationalAttainment: string | null;
  eligibility: string | null;
  mandatoryTraining: string | null;
  statusOfAppointment: string | null;
  lengthOfServiceDisplay: string | null;
  dateEnteredServiceIso: string | null;
  dateRetirementIso: string | null;
  serviceHistoryEncoded: boolean;
  recordedStationCount: number;
  confirmedHistoryCount: number;
  verificationHistoryCount: number;
  firstRecordedPeriodStartIso: string | null;
  latestRecordedPeriodStartIso: string | null;
  currentStationLabel: string | null;
  stationHistoryPreview: string[];
  historicalDesignationPreview: string[];
  stationAssignments: {
    station: string;
    years: string;
    current: boolean;
  }[];
  recentServicePeriods: {
    inclusiveDatesDisplay: string;
    station: string;
    isPresent: boolean;
    isAsinganRelated: boolean;
    authorityRef: string | null;
    confirmedDesignationLabels: string[];
    designationLabelsNeedingVerification: string[];
    sourceNote: string | null;
  }[];
  notes: string[];
}

export interface RoleAssignmentSummary {
  roleId: string;
  roleTitle: string;
  scopeName: string;
  status: string;
  statusTone: "confirmed" | "derived" | "pending";
  effectiveStartIso: string | null;
  assignee: PersonSummary | null;
  candidateDisplayNames: string[];
  note: string | null;
}

export interface GroupSummary {
  id: string;
  name: string;
  lead: RoleAssignmentSummary;
  source: string | null;
  units: OrgUnitSummary[];
}

interface OrgUnitSummary {
  id: string;
  name: string;
  lead: RoleAssignmentSummary;
  supportRoles: RoleSlot[];
  note: string | null;
  children: OrgUnitSummary[];
}

export interface LabeledCount {
  label: string;
  count: number;
}

export interface HomePageData {
  stationName: string;
  stats: StatItem[];
  missionVision: {
    mission: string;
    vision: string;
  };
  missionVisionPosters: {
    title: string;
    src: string;
    alt: string;
  }[];
  serviceHighlights: {
    title: string;
    description: string;
  }[];
  citizenCharterFlowcharts: {
    title: string;
    src: string;
    alt: string;
    description: string;
  }[];
  historyPreview: HistoryEventRecord[];
  assetPreview: VehicleAssetRecord[];
  dataNotes: string[];
  homeImages: {
    title: string;
    src: string;
    alt: string;
  }[];
}

export interface LeadershipPageData {
  fireMarshalTimeline: FireMarshalTimelineEntry[];
}

export interface OrganizationPageData {
  currentHead: RoleAssignmentSummary;
  groups: GroupSummary[];
  glossary: AcronymEntry[];
  termNotes: string[];
  dataNotes: string[];
  unresolvedRoleCount: number;
}

export interface PersonnelPageData {
  people: PersonSummary[];
  totals: {
    profileCount: number;
    serviceHistoryCount: number;
    leadershipCount: number;
  };
  caution: string[];
}

export interface PersonnelProfilePageData {
  person: PersonSummary;
}

export interface HistoryPageData {
  introNarrative: string[];
  shortVersion: string;
  timeline: HistoryEventRecord[];
  categories: LabeledCount[];
  sourceNotes: string[];
}

export interface AssetsPageData {
  assets: VehicleAssetRecord[];
  typeCounts: LabeledCount[];
}

interface RoleCatalogItem {
  title: string;
}

interface SiteSnapshot {
  currentHead: RoleAssignmentSummary;
  groups: GroupSummary[];
  fireMarshalTimeline: FireMarshalTimelineEntry[];
  people: PersonSummary[];
  stats: StatItem[];
  organizationNotes: string[];
  assignmentNotes: string[];
  glossary: AcronymEntry[];
  termNotes: string[];
  unresolvedRoleCount: number;
  historyEvents: HistoryEventRecord[];
  vehicleAssets: VehicleAssetRecord[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const STATION_NAME = "Asingan Fire Station";
const ASINGAN_BARANGAY_COUNT = 21;
const ASINGAN_POPULATION_REFERENCE = 57811;
const ASINGAN_BPLO_2025_ESTABLISHMENTS = 1568;
const INSPECTOR_RANK_PATTERN = /INSP/;
const FIRE_OFFICER_RANK_PATTERN = /^(?:SFO[1-4]|FO[1-4])$/;
const ARCHIVED_PERSONNEL_IDS = new Set(["harry-f-carig"]);
const PERSONNEL_IMAGE_VARIANTS = [
  {
    sourcePrefix: "/images/mock-personnel/personnels/",
    derivedPrefix: "/images/derived/mock-personnel/personnels/",
  },
  {
    sourcePrefix: "/images/mock-personnel/fire-marshals/",
    derivedPrefix: "/images/derived/mock-personnel/fire-marshals/",
  },
];
const HISTORY_MAIN_COPY = [
  "The early history of Asingan Fire Station is closely linked to the 1991 national reorganization of public safety services under Republic Act No. 6975. That transition separated the old PC-INP structure into the PNP, BFP, and BJMP, giving local fire services like Asingan a distinct institutional identity under the Bureau of Fire Protection.",
  "Asingan's fire service was already active in 1991 under INSP FELIX G BALLESTEROS. In those early years, before a dedicated station building was established, the unit reportedly shared office space with the PNP.",
  "By 1996, the station's more permanent physical foundation had begun to take shape. Resolution No. 4 supported the availability of a 300-square-meter parcel for the station site, and the Deed of Donation executed on February 19, 1996 formally transferred the land to the Bureau of Fire Protection for the construction of the fire station building.",
];
const HISTORY_SHORT_VERSION =
  "Asingan Fire Station traces its roots to the 1991 reorganization of public safety services under Republic Act No. 6975. In its earliest years under INSP FELIX G BALLESTEROS, the unit reportedly operated from shared office space with the PNP before a dedicated station was established. By 1996, a 300-square-meter site had been formally provided through Resolution No. 4 and a Deed of Donation, helping lay the foundation for a more permanent station home.";
const STATION_MISSION =
  "We protect life, property, and the environment through an integrated system of prevention, response, and investigation, strengthening public safety and community resilience.";
const STATION_VISION =
  "A modern and trusted fire and emergency service building safe and resilient communities.";
const HOME_SERVICE_HIGHLIGHTS = [
  {
    title: "Fire response",
    description:
      "Rapid response to fires in homes, buildings, transport equipment, and other settings that need immediate action.",
  },
  {
    title: "Fire safety inspection",
    description:
      "Inspection support and prevention work for establishments, facilities, and other occupied spaces under the Fire Code.",
  },
  {
    title: "Rescue and EMS support",
    description:
      "Emergency medical and rescue support backed by the station's ambulance and patient transport role.",
  },
  {
    title: "Fire investigation",
    description:
      "Investigation of fire incidents and coordination on cause determination as part of BFP's public safety function.",
  },
  {
    title: "Community fire safety education",
    description:
      "Preparedness reminders, public awareness activities, and barangay-level fire safety information support.",
  },
  {
    title: "Disaster response support",
    description:
      "Response assistance during man-made and natural emergencies where fire service coordination is needed.",
  },
];
const MISSION_VISION_POSTERS = [
  {
    title: "BFP mission",
    src: "/images/bfp-info/mission-bfp.jpg",
    alt: "Bureau of Fire Protection mission poster",
  },
  {
    title: "BFP vision",
    src: "/images/bfp-info/vison-bfp.jpg",
    alt: "Bureau of Fire Protection vision poster",
  },
];
const CITIZEN_CHARTER_FLOWCHARTS = [
  {
    title: "FSEC application flowchart",
    src: "/images/bfp-info/citizen-charter-1.jpg",
    alt: "Citizen charter flowchart for Application for Fire Safety Evaluation Clearance",
    description:
      "This guide is for applicants securing a building permit. The Fire Safety Evaluation Clearance (FSEC) is the fire safety prerequisite for plans, construction, renovation, and similar proposals before the building permit can proceed.",
  },
  {
    title: "FSIC for Certificate of Occupancy",
    src: "/images/bfp-info/citizen-charter-2.jpg",
    alt: "Citizen charter flowchart for Application for Fire Safety Inspection Certificate for Certificate of Occupancy",
    description:
      "This guide is for applicants securing an occupancy permit from the Office of the Building Official (OBO). The FSIC for Certificate of Occupancy is the fire safety prerequisite before the occupancy permit can be issued.",
  },
  {
    title: "FSIC for new business permit with valid occupancy FSIC",
    src: "/images/bfp-info/citizen-charter-3.jpg",
    alt: "Citizen charter flowchart for Application for Fire Safety Inspection Certificate for New Business Permit with valid FSIC for Certificate of Occupancy",
    description:
      "This guide is for new business permit applicants whose establishment already has a valid FSIC for Certificate of Occupancy. It shows the fire safety prerequisite before the business permit can proceed. For renewals, the business-related FSIC should still be valid.",
  },
  {
    title: "FSIC for new business permit without valid occupancy FSIC",
    src: "/images/bfp-info/citizen-charter-4.jpg",
    alt: "Citizen charter flowchart for Application for Fire Safety Inspection Certificate for New Business Permit without valid FSIC for Certificate of Occupancy",
    description:
      "This guide is for new business permit applicants whose establishment does not yet have a valid FSIC for Certificate of Occupancy. The premises must first be evaluated for the required fire safety compliance before the business permit can proceed, and in many cases a new building is also expected to complete its occupancy-related requirements first.",
  },
];
const HOME_HERO_IMAGES = [
  {
    title: "Municipal center from above",
    src: "/images/asingan-picture/arial-shot-2.png",
    alt: "Aerial view of the Asingan municipal center, town blocks, and surrounding fields",
  },
  {
    title: "Road corridor near the station",
    src: "/images/asingan-picture/arial-shot-1.png",
    alt: "Aerial view of the Asingan road corridor with fire trucks visible near the municipal center",
  },
  {
    title: "Station frontage",
    src: "/images/mock-station/new-fs/firestation-new-1.png",
    alt: "Current Asingan Fire Station frontage viewed from the roadside",
  },
  {
    title: "Station exterior view",
    src: "/images/mock-station/new-fs/firestation-new-2.png",
    alt: "Current Asingan Fire Station exterior from an angled side-front view",
  },
  {
    title: "Response vehicles on station grounds",
    src: "/images/mock-station/new-fs/firestation-new-3.png",
    alt: "Current Asingan Fire Station with fire trucks and ambulance lined up in front",
  },
  {
    title: "Apparatus bay and facade",
    src: "/images/mock-station/new-fs/firestation-new-4.png",
    alt: "Current Asingan Fire Station facade and apparatus bay frontage",
  },
];

async function readDataFile<T>(fileName: string): Promise<T> {
  const filePath = path.join(DATA_DIR, fileName);
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function titleCaseNameToken(token: string): string {
  const upper = token.toUpperCase();

  if (/^[A-Z]$/.test(upper)) {
    return upper;
  }

  if (upper === "JR" || upper === "SR") {
    return `${upper.charAt(0)}${upper.slice(1).toLowerCase()}`;
  }

  if (["II", "III", "IV", "V"].includes(upper)) {
    return upper;
  }

  return token
    .split("-")
    .map((part) => {
      if (!part) {
        return part;
      }

      const normalized = part.toLowerCase();
      return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    })
    .join("-");
}

function titleCaseUniformedNameBody(value: string): string {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map(titleCaseNameToken)
    .join(" ");
}

function normalizeUniformedDisplayName(displayName: string, rank: string | null | undefined): string {
  const withoutDots = displayName.replace(/\./g, "").replace(/\s+/g, " ").trim();
  const normalizedRank = rank?.toUpperCase().trim() ?? null;

  if (normalizedRank && INSPECTOR_RANK_PATTERN.test(normalizedRank)) {
    return withoutDots.toUpperCase();
  }

  if (normalizedRank && FIRE_OFFICER_RANK_PATTERN.test(normalizedRank)) {
    const body = withoutDots.replace(new RegExp(`^${escapeRegExp(normalizedRank)}\\s+`, "i"), "").trim();
    return `${normalizedRank} ${titleCaseUniformedNameBody(body)}`.trim();
  }

  return withoutDots;
}

function resolvePersonnelPhotoVariant(photoPath: string | null | undefined): string | null {
  if (!photoPath) {
    return null;
  }

  for (const variant of PERSONNEL_IMAGE_VARIANTS) {
    if (!photoPath.startsWith(variant.sourcePrefix)) {
      continue;
    }

    const derivedPath = photoPath.replace(variant.sourcePrefix, variant.derivedPrefix);
    const derivedFilePath = path.join(PUBLIC_DIR, derivedPath.replace(/^\//, ""));
    const sourceFilePath = path.join(PUBLIC_DIR, photoPath.replace(/^\//, ""));

    if (!existsSync(derivedFilePath)) {
      return photoPath;
    }

    if (!existsSync(sourceFilePath)) {
      return derivedPath;
    }

    const sourceModifiedTime = statSync(sourceFilePath).mtimeMs;
    const derivedModifiedTime = statSync(derivedFilePath).mtimeMs;

    return sourceModifiedTime > derivedModifiedTime ? photoPath : derivedPath;
  }

  return photoPath;
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function countLabels(items: string[]): LabeledCount[] {
  const counts = new Map<string, number>();

  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

function prettifyId(value: string): string {
  return value
    .split("-")
    .map((token) => {
      const upper = token.toUpperCase();
      if (["EMS", "IIU", "COMMEL"].includes(upper)) {
        return upper;
      }
      if (upper === "FS") {
        return "FS";
      }
      return token.charAt(0).toUpperCase() + token.slice(1);
    })
    .join(" ");
}

function statusTone(status: string): "confirmed" | "derived" | "pending" {
  if (status === "confirmed_current") {
    return "confirmed";
  }
  if (status.includes("derived")) {
    return "derived";
  }
  return "pending";
}

function statusLabel(status: string): string {
  if (status === "confirmed_current") {
    return "Confirmed current";
  }
  if (status.includes("derived")) {
    return "Workbook-derived";
  }
  return "Needs confirmation";
}

function isCurrentPersonnelId(personId: string): boolean {
  return !ARCHIVED_PERSONNEL_IDS.has(personId);
}

function historyEventSortValue(event: HistoryEventRecord): number {
  if (event.dateIso) {
    return new Date(event.dateIso).getTime();
  }

  const yearMatch = event.dateDisplay.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    return new Date(`${yearMatch[0]}-12-31`).getTime();
  }

  return Number.MAX_SAFE_INTEGER;
}

function compareHistoryEvents(a: HistoryEventRecord, b: HistoryEventRecord): number {
  const sortDelta = historyEventSortValue(a) - historyEventSortValue(b);
  if (sortDelta !== 0) {
    return sortDelta;
  }
  return a.title.localeCompare(b.title);
}

function fireMarshalSortValue(entry: FireMarshalTimelineEntry): number {
  if (entry.termStartIso) {
    return new Date(entry.termStartIso).getTime();
  }

  const startYearMatch = entry.termStartDisplay.match(/\b(19|20)\d{2}\b/);
  if (startYearMatch) {
    return new Date(`${startYearMatch[0]}-01-01`).getTime();
  }

  if (entry.termEndIso) {
    return new Date(entry.termEndIso).getTime();
  }

  const endYearMatch = entry.termEndDisplay.match(/\b(19|20)\d{2}\b/);
  if (endYearMatch) {
    return new Date(`${endYearMatch[0]}-12-31`).getTime();
  }

  return 0;
}

function compareFireMarshalsPresentToPast(
  a: FireMarshalTimelineEntry,
  b: FireMarshalTimelineEntry,
): number {
  if (a.status === "present" && b.status !== "present") {
    return -1;
  }

  if (b.status === "present" && a.status !== "present") {
    return 1;
  }

  const sortDelta = fireMarshalSortValue(b) - fireMarshalSortValue(a);
  if (sortDelta !== 0) {
    return sortDelta;
  }

  return a.displayName.localeCompare(b.displayName);
}

function buildRoleCatalog(organization: OrganizationStructureFile): Map<string, RoleCatalogItem> {
  const catalog = new Map<string, RoleCatalogItem>();

  catalog.set(organization.stationHeadRole.roleId, {
    title: organization.stationHeadRole.title,
  });

  const registerNodeRoles = (node: OrgNode) => {
    if (node.leadRoleId && node.leadTitle) {
      catalog.set(node.leadRoleId, {
        title: node.leadTitle,
      });
    }

    for (const role of node.roles ?? []) {
      catalog.set(role.id, {
        title: role.title,
      });
    }

    for (const child of node.children ?? []) {
      registerNodeRoles(child);
    }
  };

  for (const group of organization.groups) {
    registerNodeRoles(group);
  }

  return catalog;
}

function comparePeople(a: PersonSummary, b: PersonSummary): number {
  const leadershipDelta = b.leadershipRoleTitles.length - a.leadershipRoleTitles.length;
  if (leadershipDelta !== 0) {
    return leadershipDelta;
  }
  return a.displayName.localeCompare(b.displayName);
}

function formatRecordedYears(
  startIso: string | null | undefined,
  endIso: string | null | undefined,
  current = false,
): string {
  const startYear = startIso ? String(new Date(startIso).getFullYear()) : null;
  const endYear = current ? "Present" : endIso ? String(new Date(endIso).getFullYear()) : null;

  if (!startYear && !endYear) {
    return "Year not listed";
  }

  if (!startYear) {
    return endYear ?? "Year not listed";
  }

  if (!endYear || startYear === endYear) {
    return startYear;
  }

  return `${startYear} to ${endYear}`;
}

function toPublicHistorySummary(summary: string): string {
  return summary
    .replace(/^Based on the current project account, /i, "")
    .replace(/^Based on the current project fire marshal timeline, /i, "")
    .replace(/^Based on the current project instruction for the station history, /i, "")
    .replace(
      /The exact demolition date has not yet been confirmed in the project files\./i,
      "This marked a visible turning point in the station's move into a newer home.",
    );
}

async function loadSiteSnapshot(): Promise<SiteSnapshot> {
  const [
    organization,
    assignments,
    personnelFile,
    fireMarshals,
    serviceHistory,
    vehicleAssetsRaw,
    historyEventsRaw,
    emsHistory,
  ] = await Promise.all([
    readDataFile<OrganizationStructureFile>("organization-structure.json"),
    readDataFile<AssignmentFile>("personnel-assignments.json"),
    readDataFile<PersonnelFile>("personnels.json"),
    readDataFile<FireMarshalTimelineEntry[]>("fire-marshals.json"),
    readDataFile<ServiceHistoryFile>("personnel-service-history.json"),
    readDataFile<VehicleAssetRecord[]>("vehicles.json"),
    readDataFile<HistoryEventRecord[]>("history-events.json"),
    readDataFile<unknown[]>("ems-history.json"),
  ]);

  const roleCatalog = buildRoleCatalog(organization);
  const fireMarshalTimeline = fireMarshals.map((entry) => ({
    ...entry,
    displayName: normalizeUniformedDisplayName(entry.displayName, entry.rank),
    image: resolvePersonnelPhotoVariant(entry.image ?? null),
  }));
  const historyEvents = [...historyEventsRaw].sort(compareHistoryEvents);
  const vehicleAssets = vehicleAssetsRaw;
  const peopleById = new Map(personnelFile.records.map((record) => [record.id, record]));
  const historyByPersonnelId = new Map(serviceHistory.records.map((record) => [record.personnelId, record]));
  const currentAssignmentsByRoleId = new Map(
    assignments.currentAssignments.map((assignment) => [assignment.roleId, assignment]),
  );
  const currentAssignmentsByPersonnelId = new Map<string, AssignmentRecord[]>();

  for (const assignment of assignments.currentAssignments) {
    const current = currentAssignmentsByPersonnelId.get(assignment.personnelId) ?? [];
    current.push(assignment);
    currentAssignmentsByPersonnelId.set(assignment.personnelId, current);
  }

  const personCache = new Map<string, PersonSummary | null>();

  const buildPersonSummary = (personnelId: string): PersonSummary | null => {
    if (personCache.has(personnelId)) {
      return personCache.get(personnelId) ?? null;
    }

    const profile = peopleById.get(personnelId);
    if (!profile) {
      personCache.set(personnelId, null);
      return null;
    }

    const history = historyByPersonnelId.get(personnelId);
    const assignedRoles =
      currentAssignmentsByPersonnelId.get(personnelId)?.map((assignment) => {
        return roleCatalog.get(assignment.roleId)?.title ?? prettifyId(assignment.roleId);
      }) ?? [];
    const currentStationLabel =
      history?.coverageSummary?.stationsSeen?.find((station) => station.current)?.station ?? null;
    const stationHistoryPreview =
      history?.coverageSummary?.stationsSeen?.slice(0, 4).map((station) => station.station) ?? [];
    const stationAssignments =
      history?.coverageSummary?.stationsSeen?.map((station) => ({
        station: station.station,
        years: formatRecordedYears(
          station.firstSeenStartIso ?? null,
          station.lastSeenEndIso ?? null,
          station.current,
        ),
        current: station.current,
      })) ?? [];
    const historicalDesignationPreview = unique(
      history?.confirmedDesignationHistory?.slice(0, 8).map((designation) => designation.label) ?? [],
    ).slice(0, 6);
    const recentServicePeriods =
      history?.servicePeriods
        ?.filter((period) => {
          return (
            period.confirmedDesignationLabels.length > 0 ||
            (period.designationLabelsNeedingVerification?.length ?? 0) > 0 ||
            period.isPresent ||
            period.isAsinganRelated
          );
        })
        .slice(0, 2)
        .map((period) => ({
          inclusiveDatesDisplay: period.inclusiveDatesDisplay,
          station: period.station,
          isPresent: period.isPresent,
          isAsinganRelated: period.isAsinganRelated,
          authorityRef: period.authorityRef ?? null,
          confirmedDesignationLabels: period.confirmedDesignationLabels.slice(0, 4),
          designationLabelsNeedingVerification: (period.designationLabelsNeedingVerification ?? []).slice(0, 2),
          sourceNote: period.sourceNote ?? null,
        })) ?? [];

    const summary: PersonSummary = {
      id: profile.id,
      displayName: normalizeUniformedDisplayName(profile.displayName, profile.rank ?? null),
      rank: profile.rank ?? null,
      photo: resolvePersonnelPhotoVariant(profile.photo ?? null),
      currentDesignations: profile.designations ?? [],
      leadershipRoleTitles: unique(assignedRoles),
      educationalAttainment: profile.educationalAttainment ?? null,
      eligibility: profile.eligibility ?? null,
      mandatoryTraining: profile.mandatoryTraining ?? null,
      statusOfAppointment: profile.statusOfAppointment ?? null,
      lengthOfServiceDisplay: profile.lengthOfServiceDisplay ?? null,
      dateEnteredServiceIso: profile.dateEnteredServiceIso ?? null,
      dateRetirementIso: profile.dateRetirementIso ?? null,
      serviceHistoryEncoded: Boolean(history),
      recordedStationCount: history?.coverageSummary?.stationsSeen?.length ?? 0,
      confirmedHistoryCount: history?.confirmedDesignationHistory?.length ?? 0,
      verificationHistoryCount: history?.designationHistoryNeedingVerification?.length ?? 0,
      firstRecordedPeriodStartIso:
        history?.coverageSummary?.firstRecordedPeriodStartIso ?? profile.dateEnteredServiceIso ?? null,
      latestRecordedPeriodStartIso: history?.coverageSummary?.latestRecordedPeriodStartIso ?? null,
      currentStationLabel,
      stationHistoryPreview,
      historicalDesignationPreview,
      stationAssignments,
      recentServicePeriods,
      notes: unique([...(profile.notes ?? []), ...(history?.notes ?? [])]),
    };

    personCache.set(personnelId, summary);
    return summary;
  };

  const unresolvedByRoleId = new Map(
    assignments.unresolvedAssignments.map((entry) => [entry.roleId, entry]),
  );

  const buildRoleSummary = (roleId: string, fallbackTitle: string, scopeName: string): RoleAssignmentSummary => {
    const catalogEntry = roleCatalog.get(roleId);
    const assignment = currentAssignmentsByRoleId.get(roleId);
    const unresolved = unresolvedByRoleId.get(roleId);

    if (assignment) {
      return {
        roleId,
        roleTitle: catalogEntry?.title ?? fallbackTitle,
        scopeName,
        status: statusLabel(assignment.assignmentStatus),
        statusTone: statusTone(assignment.assignmentStatus),
        effectiveStartIso: assignment.effectiveStartIso ?? null,
        assignee: buildPersonSummary(assignment.personnelId),
        candidateDisplayNames: [],
        note: null,
      };
    }

    if (unresolved) {
      return {
        roleId,
        roleTitle: catalogEntry?.title ?? fallbackTitle,
        scopeName,
        status: "Needs confirmation",
        statusTone: "pending",
        effectiveStartIso: null,
        assignee: null,
        candidateDisplayNames: unresolved.candidatePersonnelIds.map((personnelId) => {
          return buildPersonSummary(personnelId)?.displayName ?? prettifyId(personnelId);
        }),
        note: unresolved.reason,
      };
    }

    return {
      roleId,
      roleTitle: catalogEntry?.title ?? fallbackTitle,
      scopeName,
      status: "Open role slot",
      statusTone: "pending",
      effectiveStartIso: null,
      assignee: null,
      candidateDisplayNames: [],
      note: null,
    };
  };

  const buildUnitSummary = (node: OrgNode): OrgUnitSummary => ({
    id: node.id,
    name: node.name,
    lead: buildRoleSummary(node.leadRoleId ?? `${node.id}-lead`, node.leadTitle ?? node.name, node.name),
    supportRoles: (node.roles ?? []).filter((role) => role.id !== node.leadRoleId),
    note: node.sourceNote ?? null,
    children: (node.children ?? []).map(buildUnitSummary),
  });

  const groups: GroupSummary[] = organization.groups.map((group) => ({
    id: group.id,
    name: group.name,
    lead: buildRoleSummary(group.leadRoleId ?? `${group.id}-lead`, group.leadTitle ?? group.name, group.name),
    source: group.structureSource ?? null,
    units: group.children?.map(buildUnitSummary) ?? [],
  }));

  const people = personnelFile.records
    .map((record) => buildPersonSummary(record.id))
    .filter((record): record is PersonSummary => Boolean(record))
    .sort(comparePeople);
  const currentPersonnelProfiles = people.filter((person) => isCurrentPersonnelId(person.id));

  const currentHead = buildRoleSummary(
    organization.stationHeadRole.roleId,
    organization.stationHeadRole.title,
    STATION_NAME,
  );

  const unitCount = groups.reduce((total, group) => total + group.units.length, 0);
  const stats: StatItem[] = [
    {
      value: String(currentPersonnelProfiles.length).padStart(2, "0"),
      label: "Personnel profiles",
      detail: "Public-safe personnel profiles currently listed on the website.",
    },
    {
      value: String(groups.length).padStart(2, "0"),
      label: "Major sections",
      detail: "Administrative, Fire Safety and Enforcement, and Operations Sections.",
    },
    {
      value: String(unitCount).padStart(2, "0"),
      label: "Functional units",
      detail: "Units and support functions reflected in the current organization structure.",
    },
    {
      value: String(fireMarshalTimeline.length).padStart(2, "0"),
      label: "Fire marshals tracked",
      detail: "Recorded past and present station heads in the leadership timeline.",
    },
    {
      value: String(vehicleAssets.length).padStart(2, "0"),
      label: "Vehicle records",
      detail: "Fire trucks, ambulance, and support vehicles in the station asset record.",
    },
    {
      value: String(historyEvents.length + emsHistory.length).padStart(2, "0"),
      label: "Historical records",
      detail: "History and EMS milestones currently available for public presentation.",
    },
  ];

  return {
    currentHead,
    groups,
    fireMarshalTimeline,
    people,
    stats,
    organizationNotes: organization.notes,
    assignmentNotes: assignments.notes,
    glossary: organization.acronymGlossary,
    termNotes: organization.termNotes,
    unresolvedRoleCount: assignments.unresolvedAssignments.length,
    historyEvents,
    vehicleAssets,
  };
}

export async function loadHomePageData(): Promise<HomePageData> {
  const snapshot = await loadSiteSnapshot();
  const fireTruckCount = snapshot.vehicleAssets.filter((asset) => asset.type === "Fire Truck").length;
  const ambulanceCount = snapshot.vehicleAssets.filter((asset) => asset.type === "Ambulance").length;
  const currentPersonnelCount = snapshot.people.filter((person) => isCurrentPersonnelId(person.id)).length;
  const homeStats: StatItem[] = [
    {
      value: String(fireTruckCount).padStart(2, "0"),
      label: "Response trucks",
      detail: "Fire trucks ready to support local fire response.",
    },
    {
      value: String(ambulanceCount).padStart(2, "0"),
      label: "Ambulance support",
      detail: "Emergency medical transport support for rescue operations.",
    },
    {
      value: String(currentPersonnelCount).padStart(2, "0"),
      label: "Personnel serving",
      detail: "Personnel contributing to station operations and community safety.",
    },
    {
      value: ASINGAN_BPLO_2025_ESTABLISHMENTS.toLocaleString("en-PH"),
      label: "Establishments in focus",
      detail: "Current municipal reference for establishments covered by fire safety work.",
    },
    {
      value: ASINGAN_POPULATION_REFERENCE.toLocaleString("en-PH"),
      label: "Population context",
      detail: "Municipal population reference for planning and preparedness context.",
    },
    {
      value: String(ASINGAN_BARANGAY_COUNT).padStart(2, "0"),
      label: "Barangays served",
      detail: "Barangays reached by station service and preparedness work.",
    },
  ];

  return {
    stationName: STATION_NAME,
    stats: homeStats,
    missionVision: {
      mission: STATION_MISSION,
      vision: STATION_VISION,
    },
    missionVisionPosters: MISSION_VISION_POSTERS,
    serviceHighlights: HOME_SERVICE_HIGHLIGHTS,
    citizenCharterFlowcharts: CITIZEN_CHARTER_FLOWCHARTS,
    historyPreview: snapshot.historyEvents.slice(0, 4),
    assetPreview: snapshot.vehicleAssets.slice(0, 3),
    dataNotes: [
      `Serving ${ASINGAN_BARANGAY_COUNT} barangays across Asingan.`,
      `Municipal population reference: ${ASINGAN_POPULATION_REFERENCE.toLocaleString("en-PH")}.`,
      `Business and establishment reference for 2025: ${ASINGAN_BPLO_2025_ESTABLISHMENTS.toLocaleString("en-PH")}.`,
    ],
    homeImages: HOME_HERO_IMAGES,
  };
}

export async function loadLeadershipPageData(): Promise<LeadershipPageData> {
  const snapshot = await loadSiteSnapshot();

  return {
    fireMarshalTimeline: [...snapshot.fireMarshalTimeline].sort(compareFireMarshalsPresentToPast),
  };
}

export async function loadOrganizationPageData(): Promise<OrganizationPageData> {
  const snapshot = await loadSiteSnapshot();

  return {
    currentHead: snapshot.currentHead,
    groups: snapshot.groups,
    glossary: snapshot.glossary,
    termNotes: snapshot.termNotes,
    dataNotes: snapshot.organizationNotes,
    unresolvedRoleCount: snapshot.unresolvedRoleCount,
  };
}

export async function loadPersonnelPageData(): Promise<PersonnelPageData> {
  const snapshot = await loadSiteSnapshot();
  const currentPeople = snapshot.people.filter((person) => isCurrentPersonnelId(person.id));

  return {
    people: snapshot.people,
    totals: {
      profileCount: currentPeople.length,
      serviceHistoryCount: currentPeople.filter((person) => person.serviceHistoryEncoded).length,
      leadershipCount: currentPeople.filter((person) => person.leadershipRoleTitles.length > 0).length,
    },
    caution: [
      "Only publicly shareable profile details are shown in this directory.",
      "Current designations are presented separately from recorded assignment history.",
      "Some historical shorthand remains under review and may still need confirmation before broader public use.",
    ],
  };
}

export async function loadPersonnelProfilePageData(
  personId: string,
): Promise<PersonnelProfilePageData | null> {
  const snapshot = await loadSiteSnapshot();
  const person = snapshot.people.find((entry) => entry.id === personId) ?? null;

  if (!person) {
    return null;
  }

  return { person };
}

export async function loadHistoryPageData(): Promise<HistoryPageData> {
  const snapshot = await loadSiteSnapshot();

  return {
    introNarrative: HISTORY_MAIN_COPY,
    shortVersion: HISTORY_SHORT_VERSION,
    timeline: snapshot.historyEvents.map((event) => ({
      ...event,
      summary: toPublicHistorySummary(event.summary),
    })),
    categories: countLabels(snapshot.historyEvents.map((event) => event.type)),
    sourceNotes: [
      "Timeline entries combine document-backed records, official external references, and clearly labeled local station accounts.",
      "The 1991 activation and shared-office details remain based on available local historical account while stronger station records are still being gathered.",
      "The 1996 land resolution and deed of donation entries remain among the strongest document-backed foundations in the current history file.",
    ],
  };
}

export async function loadAssetsPageData(): Promise<AssetsPageData> {
  const snapshot = await loadSiteSnapshot();

  return {
    assets: snapshot.vehicleAssets,
    typeCounts: countLabels(snapshot.vehicleAssets.map((asset) => asset.type)),
  };
}
