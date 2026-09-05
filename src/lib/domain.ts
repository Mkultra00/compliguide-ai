/**
 * Canonical domain model.
 *
 * Nothing here fabricates records. The arrays are intentionally empty until a
 * real dataset is adapted onto these shapes (see `adaptDataset` below).
 */

export type Severity = 1 | 2 | 3 | 4 | 5;

export type Signal = {
  code: string;
  detection: string;
  severity: Severity;
};

/** Deterministic signal catalog — machine / non-human identity risk. */
export const IDENTITY_SIGNALS: Signal[] = [
  { code: "NO_OWNER", detection: "No accountable owner recorded", severity: 4 },
  { code: "STALE_CREDENTIAL", detection: "Credential older than 365 days, never rotated", severity: 4 },
  { code: "WILDCARD_SCOPE", detection: "Entitlement scope contains an unbounded wildcard", severity: 4 },
  { code: "PROD_DEV_CROSS", detection: "Holds entitlements in both production and non-production", severity: 3 },
  { code: "PRIVILEGE_DELTA", detection: "Large gap between granted and exercised entitlements", severity: 3 },
  { code: "DORMANT_WAKE", detection: "No activity for 60+ days, then activity resumes", severity: 4 },
  { code: "VOLUME_SPIKE", detection: "Daily calls above baseline mean + 3 standard deviations", severity: 3 },
  { code: "NEW_GEO", detection: "Authentication from a previously unseen country or network", severity: 3 },
  { code: "IDENTITY_SPAWN", detection: "Identity created other identities or credentials", severity: 5 },
  { code: "DENIAL_BURST", detection: "Sustained authorization denials outside baseline", severity: 2 },
];

/** Deterministic check catalog — customer / document screening. */
export const SCREENING_CHECKS: Signal[] = [
  { code: "SANCTIONS", detection: "Name and alias match against consolidated sanctions lists", severity: 5 },
  { code: "OWNERSHIP_AGG", detection: "Sanctions exposure through aggregated ownership, not direct match", severity: 5 },
  { code: "PEP", detection: "Politically exposed person, including close associates", severity: 4 },
  { code: "ADVERSE_MEDIA", detection: "Relevance-filtered adverse media with disambiguation", severity: 3 },
  { code: "DOC_INTEGRITY", detection: "Document structure, metadata and template inconsistency", severity: 4 },
  { code: "MEDIA_FORENSIC", detection: "Synthetic or manipulated image / liveness capture indicators", severity: 5 },
  { code: "UBO_OPACITY", detection: "Beneficial ownership unresolved or deliberately obscured", severity: 4 },
  { code: "STRUCTURAL_FLAG", detection: "Circular ownership, shared address clustering, nominee directors", severity: 3 },
  { code: "SYNTHETIC_ID", detection: "Thin file versus claimed history, address and device reuse", severity: 4 },
  { code: "STALE_LIST", detection: "Screened against a list version older than the update SLA", severity: 3 },
];

export type CaseKind = "identity" | "screening";

export type Finding = {
  id: string;
  kind: CaseKind;
  subject: string;
  subjectDetail: string;
  owner: string | null;
  score: number;
  signals: string[];
  firstSeen: string;
  status: "open" | "in_review" | "second_review" | "closed";
};

export type EvidenceRecord = {
  id: string;
  findingId: string;
  occurredAt: string;
  actor: string;
  action: string;
  inputs: string;
  supersedes?: string;
};

export type Recommendation = {
  findingId: string;
  action: string;
  rationale: string;
  citation: string;
};

/** Control catalog — the program-level gap tracker (Appendix B style). */
export type Control = {
  id: string;
  control: string;
  section: string;
  domain: "Governance" | "Intake" | "Identity" | "Screening" | "Monitoring" | "Adjudication" | "AI risk";
};

export const CONTROL_CATALOG: Control[] = [
  { id: "C1", control: "Board-approved AML/CFT program with named accountable officer", section: "5.A", domain: "Governance" },
  { id: "C2", control: "Documented, versioned risk assessment covering products and channels", section: "5.A", domain: "Governance" },
  { id: "C3", control: "Immutable intake manifest: hashing, provenance capture, quarantine", section: "4.1", domain: "Intake" },
  { id: "C4", control: "Every artifact classified by provenance, assurance, sensitivity, freshness", section: "3", domain: "Intake" },
  { id: "C5", control: "Extracted fields carry pointers back to the source artifact", section: "4.2", domain: "Intake" },
  { id: "C6", control: "Issuer or authoritative-source verification preferred over artifact analysis", section: "4.3", domain: "Identity" },
  { id: "C7", control: "Liveness and injection-attack detection on biometric capture", section: "4.3", domain: "Identity" },
  { id: "C8", control: "Cross-session biometric collision detection across the applicant population", section: "4.3", domain: "Identity" },
  { id: "C9", control: "Beneficial ownership unwound to natural persons with a graph record", section: "4.4", domain: "Identity" },
  { id: "C10", control: "Sanctions screening with fuzzy matching, transliteration and aliases", section: "4.5", domain: "Screening" },
  { id: "C11", control: "Ownership aggregation applied to sanctions, not just direct name matching", section: "4.5", domain: "Screening" },
  { id: "C12", control: "List update ingestion SLA with rescreen of the existing book each update", section: "4.5", domain: "Screening" },
  { id: "C13", control: "Adverse media with relevance filtering and disambiguation", section: "4.5", domain: "Screening" },
  { id: "C14", control: "Explicit, versioned disposition thresholds governed as model changes", section: "4.6", domain: "Monitoring" },
  { id: "C15", control: "Continuous, trigger-driven risk profile refresh replacing periodic review", section: "2", domain: "Monitoring" },
  { id: "C16", control: "Alert-to-report conversion and outcome calibration measured", section: "4.6", domain: "Monitoring" },
  { id: "C17", control: "Four-eyes review above a defined threshold, reviewer identity recorded", section: "4.7", domain: "Adjudication" },
  { id: "C18", control: "Evidence pack reconstructable from immutable artifacts alone", section: "4.7", domain: "Adjudication" },
  { id: "C19", control: "Append-only corrections with supersession pointers, never overwrites", section: "4", domain: "Adjudication" },
  { id: "C20", control: "Inventory of agent identities, credentials, tool-call traces and decisions", section: "8", domain: "AI risk" },
  { id: "C21", control: "Model validation, drift monitoring and challenger comparison", section: "8", domain: "AI risk" },
  { id: "C22", control: "Adversarial input hardening: documents read by agents are attacker-controlled", section: "8", domain: "AI risk" },
  { id: "C23", control: "Human oversight and logging duties for high-risk automated decisions", section: "2", domain: "AI risk" },
  { id: "C24", control: "Standing red-team program using frontier agents against onboarding", section: "8", domain: "AI risk" },
];

export type ControlStatus = "unknown" | "met" | "partial" | "gap" | "not_applicable";

export const CONTROL_STATUS_LABEL: Record<ControlStatus, string> = {
  unknown: "Not assessed",
  met: "Met",
  partial: "Partial",
  gap: "Gap",
  not_applicable: "N/A",
};

/**
 * Live records. Empty by design: this app never invents cases.
 * Point `adaptDataset` at a real export to populate them.
 */
export const findings: Finding[] = [];
export const evidence: EvidenceRecord[] = [];
export const recommendations: Recommendation[] = [];

export function severityToken(sev: Severity | number): string {
  if (sev >= 5) return "text-sev-critical";
  if (sev >= 4) return "text-sev-high";
  if (sev >= 3) return "text-sev-medium";
  return "text-sev-low";
}

export function scoreBand(score: number): { label: string; token: string } {
  if (score >= 80) return { label: "Critical", token: "text-sev-critical" };
  if (score >= 60) return { label: "High", token: "text-sev-high" };
  if (score >= 35) return { label: "Medium", token: "text-sev-medium" };
  return { label: "Low", token: "text-sev-low" };
}
