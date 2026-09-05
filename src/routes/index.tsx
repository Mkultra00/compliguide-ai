import { createFileRoute } from "@tanstack/react-router";
import bridget from "@/assets/bridget-avatar.jpg";
import { AppShell } from "@/components/AppShell";
import { DATASET_FINDINGS } from "@/lib/analysis";
import { ACCESS_REVIEW, ASSET_INVENTORY, DATASET_SOURCE, ORG_NAME } from "@/lib/dataset";
import { severityToken } from "@/lib/domain";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Risk queue · Black Chamber Review" },
      {
        name: "description",
        content:
          "A voice-assisted review queue over the Regodit compliance record: access reviews and asset inventory scored by deterministic checks, each finding citing its source file.",
      },
      { property: "og:title", content: "Risk queue · Black Chamber Review" },
      {
        property: "og:description",
        content:
          "Access review and asset inventory findings from the Regodit record, each one traceable to the cell it came from.",
      },
    ],
  }),
  component: RiskQueue,
});

function RiskQueue() {
  const critical = DATASET_FINDINGS.filter((finding) => finding.severity >= 5).length;
  const high = DATASET_FINDINGS.filter((finding) => finding.severity === 4).length;

  return (
    <AppShell
      eyebrow={`Queue 01 · ${ORG_NAME} internal record`}
      title="Risk queue"
      intro="Findings raised by fixed rules over the access review and asset inventory in your dataset. The assistant narrows and explains; a person decides. Nothing here can revoke, rotate or disable anything."
    >
      <section className="panel grid gap-4 p-5 sm:grid-cols-4">
        {[
          { label: "Findings", value: DATASET_FINDINGS.length },
          { label: "Critical", value: critical },
          { label: "High", value: high },
          { label: "Records read", value: ACCESS_REVIEW.length + ASSET_INVENTORY.length },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{stat.value}</p>
          </div>
        ))}
        <p className="sm:col-span-4 font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
          source · {DATASET_SOURCE}
        </p>
      </section>

      <section className="panel overflow-hidden">
        <div className="flex flex-wrap items-baseline justify-between gap-2 p-5">
          <h2 className="text-base font-semibold">Findings</h2>
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
            {DATASET_FINDINGS.length} raised by rule
          </p>
        </div>
        <ul>
          {DATASET_FINDINGS.map((finding) => (
            <li key={finding.id} className="hairline space-y-2 px-5 py-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className={`font-mono text-xs ${severityToken(finding.severity)}`}>
                  SEV {finding.severity}
                </span>
                <span className="font-mono text-xs text-primary">{finding.code}</span>
                <span className="text-sm font-medium">{finding.subject}</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{finding.detail}</p>
              <p className="text-sm leading-relaxed">
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                  next step ·{" "}
                </span>
                {finding.recommendation}
              </p>
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-muted-foreground">
                read from {finding.source} · cites {finding.citation}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
