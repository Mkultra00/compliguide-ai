import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { DATASET_FINDINGS, QUESTIONNAIRE_ANSWERED, QUESTIONNAIRE_TOTAL, TOPIC_COVERAGE } from "@/lib/analysis";
import { DATASET_SOURCE, SOURCE_DOCS } from "@/lib/dataset";
import { severityToken } from "@/lib/domain";

export const Route = createFileRoute("/advisory")({
  head: () => ({
    meta: [
      { title: "Advisory · Black Chamber Review" },
      {
        name: "description",
        content:
          "Recommendations drawn from the Regodit record: each one names the finding it answers, the file it was read from, and the policy it cites. Not legal advice.",
      },
      { property: "og:title", content: "Advisory · Black Chamber Review" },
      {
        property: "og:description",
        content: "Recommendations with citations, drawn only from the record, with no write access to any system.",
      },
    ],
  }),
  component: Advisory,
});

function Advisory() {
  const gapTopics = TOPIC_COVERAGE.filter((topic) => topic.policyEvidence.length === 0);
  const programNotes = [
    {
      title: "The questionnaire is the blocking item",
      body: `${QUESTIONNAIRE_TOTAL - QUESTIONNAIRE_ANSWERED} of ${QUESTIONNAIRE_TOTAL} questions have no response recorded. Until they do, the assessment rests on the policy set alone, and policy without an answer is intent, not control.`,
      citation: "Regodit_Vendor_Risk_Management_Policy.docx",
    },
    {
      title: "Production access is the sharpest exposure in the record",
      body: "The AWS Production Console review flags accounts as not justified, including a contractor with Admin. Those are the findings a regulator or customer auditor reaches for first.",
      citation: "Regodit_access_control_policy_v1.0.docx",
    },
    {
      title: gapTopics.length === 0 ? "Every topic has evidence on file" : "Topics with no supporting evidence",
      body:
        gapTopics.length === 0
          ? "Each questionnaire topic maps to at least one policy, report or diagram in the record."
          : `${gapTopics.map((topic) => topic.topic).join(", ")} — answers on these topics have nothing in the record behind them.`,
      citation: `${SOURCE_DOCS.length} files reviewed`,
    },
    {
      title: "Nothing here acts on a system",
      body: "This app reads the record and recommends. There is no revoke, rotate or disable path, which is the only defence against a manipulated instruction that actually holds.",
      citation: "Design constraint",
    },
  ];

  return (
    <AppShell
      eyebrow="Advisory"
      title="Recommendations"
      intro={`Written to be read by a reviewer who has to defend the decision later. Every figure below was read from ${DATASET_SOURCE} — none of it comes from the model.`}
    >
      <section className="grid gap-4 sm:grid-cols-2">
        {programNotes.map((note) => (
          <article key={note.title} className="panel p-5">
            <h2 className="text-base font-semibold">{note.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{note.body}</p>
            <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
              cites {note.citation}
            </p>
          </article>
        ))}
      </section>

      <section className="panel overflow-hidden">
        <div className="flex flex-wrap items-baseline justify-between gap-2 p-5">
          <h2 className="text-base font-semibold">Case recommendations</h2>
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            {DATASET_FINDINGS.length} findings
          </p>
        </div>
        <ul>
          {DATASET_FINDINGS.map((finding) => (
            <li key={finding.id} className="hairline space-y-2 px-5 py-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className={`font-mono text-xs ${severityToken(finding.severity)}`}>SEV {finding.severity}</span>
                <span className="text-sm font-medium">{finding.subject}</span>
              </div>
              <p className="text-sm leading-relaxed">{finding.recommendation}</p>
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                because {finding.code} · read from {finding.source} · cites {finding.citation}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
