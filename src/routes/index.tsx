import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { SignalCatalog } from "@/components/SignalCatalog";
import { IDENTITY_SIGNALS, findings } from "@/lib/domain";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Risk queue · Black Chamber Review" },
      {
        name: "description",
        content:
          "A voice-assisted review queue for machine identity risk: deterministic signals, scored findings, and an evidence trail built for audit.",
      },
      { property: "og:title", content: "Risk queue · Black Chamber Review" },
      {
        property: "og:description",
        content:
          "Deterministic signals, scored findings and an audit-ready evidence trail, with a voice analyst alongside.",
      },
    ],
  }),
  component: RiskQueue,
});

function RiskQueue() {
  const open = findings.filter((finding) => finding.kind === "identity");

  return (
    <AppShell
      eyebrow="Queue 01 · machine identity"
      title="Risk queue"
      intro="Service accounts, keys, workload and agent identities scored by deterministic checks. The assistant narrows and explains; a person decides. Nothing here can revoke, rotate or disable anything."
    >
      {open.length === 0 ? (
        <EmptyState
          title="No identities loaded yet"
          body="Upload your identity export and I will map it onto the canonical shape, run the checks below, and fill this queue. Until then the queue stays empty on purpose — this app never shows invented records."
        />
      ) : null}

      <SignalCatalog
        title="Identity checks"
        note="Each check is a plain rule with a fixed severity, not a model judgement. Scores are a weighted sum of the checks that fired, so any score can be taken apart and explained."
        signals={IDENTITY_SIGNALS}
      />
    </AppShell>
  );
}
