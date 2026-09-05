/**
 * Builds the plain-text briefing given to the voice assistant as knowledge.
 * Everything in it is read from the transcribed dataset and the deterministic
 * findings — no model output, no invented records.
 */

import {
  ACCESS_REVIEW,
  ACCESS_REVIEW_DATE,
  ACCESS_REVIEW_SYSTEM,
  ACCESS_REVIEWER,
  ASSET_INVENTORY,
  DATASET_SOURCE,
  ORG_NAME,
  QUESTIONNAIRE,
  SOURCE_DOCS,
} from "./dataset";
import {
  DATASET_FINDINGS,
  QUESTIONNAIRE_ANSWERED,
  QUESTIONNAIRE_TOTAL,
  TOPIC_COVERAGE,
} from "./analysis";

export const KNOWLEDGE_DOC_NAME = "Regodit compliance dataset briefing";

export function buildKnowledgeBriefing(): string {
  const lines: string[] = [];

  lines.push(`# ${ORG_NAME} compliance review dataset briefing`);
  lines.push(`Source repository: ${DATASET_SOURCE}`);
  lines.push(
    "Rule: quote only figures and records that appear below. If something is not in this briefing, say it is not in the record.",
  );
  lines.push("");

  lines.push(`## Access review — ${ACCESS_REVIEW_SYSTEM}`);
  lines.push(`Reviewed ${ACCESS_REVIEW_DATE} by ${ACCESS_REVIEWER}. ${ACCESS_REVIEW.length} accounts reviewed.`);
  for (const row of ACCESS_REVIEW) {
    lines.push(
      `- ${row.user} (${row.email}), department ${row.department}, role ${row.role}, last login ${row.lastLogin}, justified ${row.justified}, action ${row.actionNeeded ?? "none"}, revised role ${row.revisedRole ?? "none"}`,
    );
  }
  lines.push("");

  lines.push(`## Asset inventory — ${ASSET_INVENTORY.length} records`);
  for (const asset of ASSET_INVENTORY) {
    lines.push(
      `- ${asset.serial}: ${asset.type} ${asset.description}, assigned to ${asset.assignedTo}, purchased ${asset.purchaseDate}, supplier ${asset.supplier}, status ${asset.status}, disposal ${asset.disposalDate ?? "none"}, notes ${asset.notes ?? "none"}`,
    );
  }
  lines.push("");

  lines.push("## Vendor questionnaire coverage");
  lines.push(`${QUESTIONNAIRE_ANSWERED} of ${QUESTIONNAIRE_TOTAL} questions answered.`);
  for (const topic of TOPIC_COVERAGE) {
    lines.push(
      `- ${topic.topic}: ${topic.answered}/${topic.total} answered; supporting documents: ${
        topic.policyEvidence.length > 0 ? topic.policyEvidence.join(", ") : "none in the corpus"
      }`,
    );
  }
  lines.push("");

  lines.push("## Questionnaire questions");
  for (const row of QUESTIONNAIRE) {
    lines.push(`- [${row.topic}] Q${row.id}: ${row.question} — response: ${row.response ?? "blank"}`);
  }
  lines.push("");

  lines.push(`## Findings raised by fixed rules — ${DATASET_FINDINGS.length} total`);
  for (const finding of DATASET_FINDINGS) {
    lines.push(
      `- ${finding.code} (severity ${finding.severity}) on ${finding.subject}: ${finding.detail} Recommended: ${finding.recommendation} Source: ${finding.source}. Policy reference: ${finding.citation}`,
    );
  }
  lines.push("");

  lines.push("## Source documents in the corpus");
  for (const doc of SOURCE_DOCS) {
    lines.push(`- ${doc.folder}/${doc.file} (${doc.kind})`);
  }

  return lines.join("\n");
}
