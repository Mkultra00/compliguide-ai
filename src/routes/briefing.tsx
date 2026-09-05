import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import {
  DATASET_FINDINGS,
  QUESTIONNAIRE_ANSWERED,
  QUESTIONNAIRE_TOTAL,
  TOPIC_COVERAGE,
} from "@/lib/analysis";
import { ACCESS_REVIEW, ASSET_INVENTORY, DATASET_SOURCE, ORG_NAME } from "@/lib/dataset";
import { severityToken } from "@/lib/domain";

export const Route = createFileRoute("/briefing")({
  head: () => ({
    meta: [
      { title: "Briefing visuals · Black Chamber Review" },
      {
        name: "description",
        content:
          "Render the Regodit compliance briefing on demand: severity spread, access review outcomes, questionnaire coverage and every finding with its source citation.",
      },
      { property: "og:title", content: "Briefing visuals · Black Chamber Review" },
      {
        property: "og:description",
        content:
          "One button renders the charts and findings behind the Regodit compliance briefing, straight from the record.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Briefing,
});

const SEVERITY_DATA = [5, 4, 3, 2, 1].map((level) => ({
  name: `Severity ${level}`,
  value: DATASET_FINDINGS.filter((f) => f.severity === level).length,
}));

const ACCESS_DATA = [
  { name: "Justified", value: ACCESS_REVIEW.filter((r) => /^y/i.test(r.justified.trim())).length },
  { name: "Not justified", value: ACCESS_REVIEW.filter((r) => !/^y/i.test(r.justified.trim())).length },
];

const COVERAGE_DATA = TOPIC_COVERAGE.map((t) => ({
  topic: t.topic,
  outstanding: t.total - t.answered,
}));

const PIE_COLORS = ["var(--voice)", "var(--destructive)"];

function Briefing() {
  const [rendered, setRendered] = useState(false);

  return (
    <AppShell
      eyebrow={`Briefing · ${ORG_NAME} internal record`}
      title="Briefing visuals"
      intro="Press render to draw the briefing the assistant works from: severity spread, access outcomes, questionnaire gaps and each finding with the file it came from. Every number is read from the record."
    >
      <section className="panel flex flex-wrap items-center justify-between gap-3 p-5">
        <p className="text-sm text-muted-foreground">
          {DATASET_FINDINGS.length} findings · {ACCESS_REVIEW.length + ASSET_INVENTORY.length} records ·{" "}
          {QUESTIONNAIRE_ANSWERED}/{QUESTIONNAIRE_TOTAL} questions answered
        </p>
        <div className="flex gap-2">
          <Button onClick={() => setRendered(true)}>
            {rendered ? "Re-render briefing" : "Render briefing & findings"}
          </Button>
          {rendered ? (
            <Button variant="secondary" onClick={() => setRendered(false)}>
              Clear
            </Button>
          ) : null}
        </div>
      </section>

      {!rendered ? (
        <section className="panel p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Nothing is drawn yet. The visuals stay hidden until you ask for them, so the page never implies a
            reading of the record you have not requested.
          </p>
        </section>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="panel p-5">
              <p className="label-eyebrow">Severity spread</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SEVERITY_DATA}>
                    <XAxis dataKey="name" stroke="currentColor" fontSize={11} />
                    <YAxis allowDecimals={false} stroke="currentColor" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="value" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="panel p-5">
              <p className="label-eyebrow">Access review outcomes</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ACCESS_DATA} dataKey="value" nameKey="name" outerRadius={90} label>
                      {ACCESS_DATA.map((entry, index) => (
                        <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <section className="panel p-5">
            <p className="label-eyebrow">Unanswered questions by topic</p>
            <div className="mt-4 h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={COVERAGE_DATA} layout="vertical" margin={{ left: 140 }}>
                  <XAxis type="number" allowDecimals={false} stroke="currentColor" fontSize={11} />
                  <YAxis type="category" dataKey="topic" width={140} stroke="currentColor" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="outstanding" fill="var(--destructive)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="panel p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-base font-semibold">Findings</h2>
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
                source · {DATASET_SOURCE}
              </p>
            </div>
            <ul className="mt-4 space-y-4">
              {DATASET_FINDINGS.map((finding) => (
                <li key={finding.id} className="hairline pt-4 first:border-0 first:pt-0">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className={`font-mono text-xs ${severityToken(finding.severity)}`}>
                      {finding.code} · sev {finding.severity}
                    </span>
                    <span className="text-sm font-semibold">{finding.subject}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{finding.detail}</p>
                  <p className="mt-1 text-sm leading-relaxed">{finding.recommendation}</p>
                  <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                    {finding.source} · {finding.citation}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </AppShell>
  );
}
