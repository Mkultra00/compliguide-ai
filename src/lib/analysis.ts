/**
 * Deterministic analysis of the Regodit dataset.
 *
 * Every finding below is produced by a plain rule reading a specific cell in a
 * specific source file. No model, no inference, no invented records — which is
 * why each finding carries the source it was read from.
 */

import {
  ACCESS_REVIEW,
  ACCESS_REVIEW_DATE,
  ACCESS_REVIEW_SYSTEM,
  ASSET_INVENTORY,
  QUESTIONNAIRE,
  SOURCE_DOCS,
  type AccessRow,
  type AssetRow,
} from "./dataset";
import type { Severity } from "./domain";

export type DatasetFinding = {
  id: string;
  code: string;
  severity: Severity;
  subject: string;
  detail: string;
  source: string;
  recommendation: string;
  citation: string;
};

/** Review date of the access records, used as the fixed "as of" date. */
const AS_OF = new Date(2026, 8, 4);

function parseMmDdYy(value: string): Date | null {
  const parts = value.split("-").map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
  const [month, day, year] = parts as [number, number, number];
  return new Date(2000 + year, month - 1, day);
}

function parseMmDdYyyy(value: string): Date | null {
  const parts = value.split("/").map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) return null;
  const [month, day, year] = parts as [number, number, number];
  return new Date(year, month - 1, day);
}

function daysBetween(from: Date, to: Date): number {
  return Math.round((to.getTime() - from.getTime()) / 86_400_000);
}

const ACCESS_SOURCE = `Access_Review_Records.xlsx · ${ACCESS_REVIEW_SYSTEM} · reviewed ${ACCESS_REVIEW_DATE}`;
const ASSET_SOURCE = "Asset_Inventory_Regodit.xlsx · Regodit asset inventory";

function accessFindings(): DatasetFinding[] {
  const out: DatasetFinding[] = [];

  ACCESS_REVIEW.forEach((row: AccessRow, index) => {
    const key = `ACC-${String(index + 1).padStart(2, "0")}`;
    const admin = row.role.toLowerCase() === "admin";
    const contractor = row.department.toLowerCase().includes("contractor");

    if (row.justified === "N") {
      out.push({
        id: `${key}-UNJUSTIFIED`,
        code: admin ? "ADMIN_NOT_JUSTIFIED" : "ACCESS_NOT_JUSTIFIED",
        severity: admin ? 5 : 3,
        subject: `${row.user} · ${row.role}`,
        detail: `Reviewer marked access to ${ACCESS_REVIEW_SYSTEM} as not justified. Action recorded: ${
          row.actionNeeded ?? "none"
        }${row.revisedRole ? `, revised role ${row.revisedRole}` : ""}.`,
        source: ACCESS_SOURCE,
        recommendation:
          row.actionNeeded === "Revoke access"
            ? `Revoke ${row.email} from ${ACCESS_REVIEW_SYSTEM} and record the ticket reference against this review.`
            : `Reduce ${row.email} to ${row.revisedRole ?? "the least-privilege role"} and confirm the change in the next review cycle.`,
        citation: "Regodit_access_control_policy_v1.0.docx",
      });
    }

    if (contractor && admin) {
      out.push({
        id: `${key}-CONTRACTOR_ADMIN`,
        code: "CONTRACTOR_ADMIN",
        severity: 5,
        subject: `${row.user} · ${row.department}`,
        detail: `A contractor holds Admin on ${ACCESS_REVIEW_SYSTEM}. Contractor privilege on production is the highest-consequence combination in this record.`,
        source: ACCESS_SOURCE,
        recommendation:
          "Confirm the contract is still active, then remove standing Admin and move the work to time-boxed, approved elevation.",
        citation: "Regodit_access_control_policy_v1.0.docx · Master Services Agreement.docx",
      });
    }

    const login = parseMmDdYy(row.lastLogin);
    if (login) {
      const idle = daysBetween(login, AS_OF);
      if (idle >= 60) {
        out.push({
          id: `${key}-DORMANT`,
          code: admin ? "DORMANT_ADMIN" : "DORMANT_ACCOUNT",
          severity: admin ? 4 : 2,
          subject: `${row.user} · ${row.role}`,
          detail: `Last login ${row.lastLogin} — ${idle} days before the ${ACCESS_REVIEW_DATE} review. Unused access is still usable access.`,
          source: ACCESS_SOURCE,
          recommendation: `Disable or downgrade ${row.email} until the account is needed again, and record who confirmed it.`,
          citation: "Regodit_access_control_policy_v1.0.docx",
        });
      }
    }
  });

  const admins = ACCESS_REVIEW.filter((row) => row.role.toLowerCase() === "admin").length;
  if (admins / ACCESS_REVIEW.length > 0.4) {
    out.push({
      id: "ACC-ADMIN_DENSITY",
      code: "ADMIN_DENSITY",
      severity: 4,
      subject: `${ACCESS_REVIEW_SYSTEM} · ${admins} of ${ACCESS_REVIEW.length} reviewed users are Admin`,
      detail:
        "More than 40% of reviewed accounts hold Admin on a production system, which makes least privilege unenforceable in practice.",
      source: ACCESS_SOURCE,
      recommendation:
        "Define the minimum Admin population for this system, name an owner for each, and move everyone else to Editor or Viewer.",
      citation: "Regodit_access_control_policy_v1.0.docx",
    });
  }

  return out;
}

function assetFindings(): DatasetFinding[] {
  const out: DatasetFinding[] = [];

  ASSET_INVENTORY.forEach((asset: AssetRow) => {
    const owner = asset.assignedTo.toLowerCase();

    if (owner === "unassigned" || owner.startsWith("n/a")) {
      out.push({
        id: `${asset.serial}-NO_OWNER`,
        code: "ASSET_NO_OWNER",
        severity: owner.startsWith("n/a") ? 3 : 2,
        subject: `${asset.serial} · ${asset.description}`,
        detail: `Recorded as "${asset.assignedTo}" — no accountable person is named for this ${asset.type.toLowerCase()}.`,
        source: ASSET_SOURCE,
        recommendation: "Name an individual custodian, not a team or a placeholder, and record it in the inventory.",
        citation: "Regodit_asset_management_policy_v1.0.docx",
      });
    }

    if (owner.includes("contractor") && asset.status !== "Retired") {
      out.push({
        id: `${asset.serial}-CONTRACTOR_ASSET`,
        code: "CONTRACTOR_ASSET_ACTIVE",
        severity: 3,
        subject: `${asset.serial} · ${asset.description}`,
        detail: "Company asset held by a contractor and not retired.",
        source: ASSET_SOURCE,
        recommendation: "Confirm the engagement is current or start the return-and-wipe step of offboarding.",
        citation: "Regodit_asset_management_policy_v1.0.docx",
      });
    }

    if (asset.type === "Mobile Phone" || asset.type === "Tablet") {
      const managed = (asset.notes ?? "").toUpperCase().includes("MDM");
      if (!managed) {
        out.push({
          id: `${asset.serial}-NO_MDM`,
          code: "MOBILE_UNMANAGED",
          severity: 4,
          subject: `${asset.serial} · ${asset.description}`,
          detail: "No MDM enrolment recorded for a mobile device that can hold company data.",
          source: ASSET_SOURCE,
          recommendation: "Enrol the device in MDM or record why it is exempt, with an approver.",
          citation: "Regodit_asset_management_policy_v1.0.docx · Regodit_data_classification_policy_v1.0.docx",
        });
      }
    }

    const purchased = parseMmDdYyyy(asset.purchaseDate);
    if (purchased && asset.status !== "Retired" && daysBetween(purchased, AS_OF) > 4 * 365) {
      out.push({
        id: `${asset.serial}-AGEING`,
        code: "ASSET_END_OF_LIFE",
        severity: 3,
        subject: `${asset.serial} · ${asset.description}`,
        detail: `Purchased ${asset.purchaseDate} and still in service — past a four-year life for a device on the production path.`,
        source: ASSET_SOURCE,
        recommendation: "Set a refresh or extended-support decision date and record who owns it.",
        citation: "Regodit_asset_management_policy_v1.0.docx",
      });
    }
  });

  const cryptoNotes = ASSET_INVENTORY.some((asset) => (asset.notes ?? "").toLowerCase().includes("encrypt"));
  if (!cryptoNotes) {
    out.push({
      id: "ASSET-NO_ENCRYPTION_EVIDENCE",
      code: "NO_ENCRYPTION_EVIDENCE",
      severity: 3,
      subject: `Asset inventory · ${ASSET_INVENTORY.length} records`,
      detail:
        "No record in the inventory states disk encryption status, so the encryption claim in the policy cannot be evidenced from this file.",
      source: ASSET_SOURCE,
      recommendation: "Add an encryption column to the inventory and populate it from the endpoint management console.",
      citation: "Regodit_cryptography_policy_v1.0.docx",
    });
  }

  return out;
}

export const DATASET_FINDINGS: DatasetFinding[] = [...accessFindings(), ...assetFindings()].sort(
  (a, b) => b.severity - a.severity,
);

export type TopicCoverage = {
  topic: string;
  total: number;
  answered: number;
  policyEvidence: string[];
};

const TOPIC_POLICY_HINTS: Record<string, string[]> = {
  Governance: ["information_security_policy", "risk_management_policy"],
  "Third-Party Risk Management": ["Vendor_Risk_Management_Policy"],
  "Security Awareness & Training": ["hr_policy", "code_of_conduct_policy"],
  Privacy: ["data_classification_policy"],
  "Data Security": ["data_classification_policy", "cryptography_policy"],
  "Physical Security": ["asset_management_policy"],
  "Web Application Security": ["Secure Development Lifecycle"],
  "Secure Coding": ["Secure Development Lifecycle"],
  "Vulnerability Management": ["vulnerability_and_patch_management_policy", "VAPT Report"],
  "Business Continuity & Disaster Recovery": ["business_continuity", "BCP_DR_Plan"],
  "Incident Response": ["Incident_Management_Policy"],
  "Network & Endpoint Security": ["network_architecture_diagrams", "network-segmentation-diagram"],
  "Asset Management": ["asset_management_policy", "Asset_Inventory"],
  "Risk Assessment": ["risk_management_policy", "SOC2", "VAPT Report"],
};

export const TOPIC_COVERAGE: TopicCoverage[] = (() => {
  const order: string[] = [];
  const byTopic = new Map<string, { total: number; answered: number }>();

  for (const row of QUESTIONNAIRE) {
    if (!byTopic.has(row.topic)) {
      byTopic.set(row.topic, { total: 0, answered: 0 });
      order.push(row.topic);
    }
    const bucket = byTopic.get(row.topic)!;
    bucket.total += 1;
    if (row.response && row.response.trim() !== "") bucket.answered += 1;
  }

  return order.map((topic) => {
    const bucket = byTopic.get(topic)!;
    const hints = TOPIC_POLICY_HINTS[topic] ?? [];
    const policyEvidence = SOURCE_DOCS.filter((doc) =>
      hints.some((hint) => doc.file.toLowerCase().includes(hint.toLowerCase())),
    ).map((doc) => doc.file);
    return { topic, total: bucket.total, answered: bucket.answered, policyEvidence };
  });
})();

export const QUESTIONNAIRE_TOTAL = QUESTIONNAIRE.length;
export const QUESTIONNAIRE_ANSWERED = QUESTIONNAIRE.filter(
  (row) => row.response && row.response.trim() !== "",
).length;
