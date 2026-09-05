import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { QUESTIONNAIRE_ANSWERED, QUESTIONNAIRE_TOTAL, TOPIC_COVERAGE } from "@/lib/analysis";
import { ORG_NAME, QUESTIONNAIRE, SOURCE_DOCS } from "@/lib/dataset";

export const Route = createFileRoute("/screening")({
  head: () => ({
    meta: [
      { title: "Vendor due diligence · Black Chamber Review" },
      {
        name: "description",
        content:
          "Coverage of the 65-question Regodit vendor security questionnaire, topic by topic, with the policy and report evidence available for each topic.",
      },
      { property: "og:title", content: "Vendor due diligence · Black Chamber Review" },
      {
        property: "og:description",
        content:
          "Questionnaire coverage topic by topic, with the policy and assessment evidence that supports each answer.",
      },
    ],
  }),
  component: Screening,
});

function Screening() {
  const outstanding = QUESTIONNAIRE_TOTAL - QUESTIONNAIRE_ANSWERED;

  return (
    <AppShell
      eyebrow="Queue 02 · vendor due diligence"
      title="Questionnaire coverage"
      intro={`The ${ORG_NAME} security questionnaire holds ${QUESTIONNAIRE_TOTAL} questions across ${TOPIC_COVERAGE.length} topics. Coverage below is counted from the response column, not estimated, so an unanswered question is shown as unanswered.`}
    >
      <section className="panel grid gap-4 p-5 sm:grid-cols-4">
        {[
          { label: "Questions", value: QUESTIONNAIRE_TOTAL },
          { label: "Answered", value: QUESTIONNAIRE_ANSWERED },
          { label: "Outstanding", value: outstanding },
          { label: "Evidence files", value: SOURCE_DOCS.length },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="panel overflow-hidden">
        <div className="flex flex-wrap items-baseline justify-between gap-2 p-5">
          <h2 className="text-base font-semibold">Topics</h2>
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            {TOPIC_COVERAGE.length} topics
          </p>
        </div>
        <ul>
          {TOPIC_COVERAGE.map((topic) => (
            <li key={topic.topic} className="hairline space-y-2 px-5 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-sm font-medium">{topic.topic}</span>
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                  {topic.answered}/{topic.total} answered
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {topic.policyEvidence.length === 0
                  ? "No policy or report in the record maps to this topic — answers here would rest on assertion alone."
                  : `Evidence on file: ${topic.policyEvidence.join(", ")}`}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel overflow-hidden">
        <div className="p-5">
          <h2 className="text-base font-semibold">Outstanding questions</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Every question still without a response, in questionnaire order. These are what a reviewer has to chase
            before the assessment can be signed.
          </p>
        </div>
        <ul>
          {QUESTIONNAIRE.filter((row) => !row.response || row.response.trim() === "").map((row) => (
            <li key={row.id} className="hairline flex gap-4 px-5 py-3">
              <span className="font-mono text-xs text-primary">{String(row.id).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm">{row.question}</p>
                <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                  {row.topic}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
