import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { SignalCatalog } from "@/components/SignalCatalog";
import { SCREENING_CHECKS, findings } from "@/lib/domain";

export const Route = createFileRoute("/screening")({
  head: () => ({
    meta: [
      { title: "Screening cases · Black Chamber Review" },
      {
        name: "description",
        content:
          "Customer and document screening cases: sanctions, ownership, adverse media and forgery checks with a reconstructable evidence pack per decision.",
      },
      { property: "og:title", content: "Screening cases · Black Chamber Review" },
      {
        property: "og:description",
        content:
          "Sanctions, ownership, adverse media and document forgery checks, each with a reconstructable evidence pack.",
      },
    ],
  }),
  component: Screening,
});

const stages = [
  { step: "01", name: "Intake", detail: "Manifest, hashing, provenance capture, quarantine" },
  { step: "02", name: "Extraction", detail: "Parse and normalise fields, each with a pointer to its source" },
  { step: "03", name: "Authentication", detail: "Document integrity, media forensics, liveness, issuer check" },
  { step: "04", name: "Resolution", detail: "Entity matching, ownership unwound to natural persons" },
  { step: "05", name: "Screening", detail: "Lists, ownership aggregation, adverse media, typologies" },
  { step: "06", name: "Scoring", detail: "Versioned thresholds; a threshold change is a governed change" },
  { step: "07", name: "Adjudication", detail: "Two-person review above threshold, evidence pack sealed" },
];

function Screening() {
  const cases = findings.filter((finding) => finding.kind === "screening");

  return (
    <AppShell
      eyebrow="Queue 02 · customer and document screening"
      title="Screening cases"
      intro="Onboarding files, registries, statements and captures run against a fixed set of checks. Corrections are appended, never overwritten, so the record always answers what was known and when."
    >
      {cases.length === 0 ? (
        <EmptyState
          title="No cases loaded yet"
          body="Upload the document or data corpus you want screened. Each file will be classified by where it came from, how strongly it is assured, how sensitive it is, and how fresh it is — before any check runs."
        />
      ) : null}

      <section className="panel p-5">
        <h2 className="text-base font-semibold">Pipeline</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Seven stages. Each one leaves a permanent artifact the next stage reads.
        </p>
        <ol className="mt-5 space-y-0">
          {stages.map((stage) => (
            <li key={stage.step} className="hairline flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
              <span className="font-mono text-xs text-primary">{stage.step}</span>
              <span className="w-32 text-sm font-medium">{stage.name}</span>
              <span className="min-w-0 flex-1 text-sm text-muted-foreground">{stage.detail}</span>
            </li>
          ))}
        </ol>
      </section>

      <SignalCatalog
        title="Screening checks"
        note="Checks that reduce to 'does this document look real' are on a losing trajectory. Wherever an issuing authority can confirm the fact directly, that path takes precedence and the assurance level is recorded."
        signals={SCREENING_CHECKS}
      />
    </AppShell>
  );
}
