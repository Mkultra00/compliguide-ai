import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import {
  CONTROL_CATALOG,
  CONTROL_STATUS_LABEL,
  type Control,
  type ControlStatus,
} from "@/lib/domain";

export const Route = createFileRoute("/controls")({
  head: () => ({
    meta: [
      { title: "Control gaps · Black Chamber Review" },
      {
        name: "description",
        content:
          "A program-level gap assessment across governance, intake, identity, screening, monitoring, adjudication and AI risk controls.",
      },
      { property: "og:title", content: "Control gaps · Black Chamber Review" },
      {
        property: "og:description",
        content: "Track every control, its owner, where the evidence lives, and how big the gap is.",
      },
    ],
  }),
  component: Controls,
});

type Assessment = { status: ControlStatus; owner: string; evidence: string };

const STORAGE_KEY = "bc.controls.assessment";
const STATUSES: ControlStatus[] = ["unknown", "met", "partial", "gap", "not_applicable"];

const statusToken: Record<ControlStatus, string> = {
  unknown: "text-muted-foreground",
  met: "text-sev-low",
  partial: "text-sev-medium",
  gap: "text-sev-critical",
  not_applicable: "text-muted-foreground",
};

const domains = [...new Set(CONTROL_CATALOG.map((control) => control.domain))];

function Controls() {
  const [assessment, setAssessment] = useState<Record<string, Assessment>>({});

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setAssessment(JSON.parse(stored) as Record<string, Assessment>);
      } catch {
        /* ignore malformed local state */
      }
    }
  }, []);

  function update(id: string, patch: Partial<Assessment>) {
    setAssessment((prev) => {
      const base: Assessment = prev[id] ?? { status: "unknown", owner: "", evidence: "" };
      const next: Record<string, Assessment> = { ...prev, [id]: { ...base, ...patch } };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  const tally = useMemo(() => {
    const counts: Record<ControlStatus, number> = {
      unknown: 0,
      met: 0,
      partial: 0,
      gap: 0,
      not_applicable: 0,
    };
    for (const control of CONTROL_CATALOG) {
      counts[assessment[control.id]?.status ?? "unknown"] += 1;
    }
    return counts;
  }, [assessment]);

  return (
    <AppShell
      eyebrow="Program level"
      title="Control gaps"
      intro="Twenty-four controls drawn from the reference architecture. Mark where you stand, who owns it, and where the evidence lives. Anything left unassessed counts as unknown, not as met."
    >
      <section className="panel grid grid-cols-2 gap-px overflow-hidden sm:grid-cols-5">
        {STATUSES.map((status) => (
          <div key={status} className="bg-card p-4">
            <p className="label-eyebrow">{CONTROL_STATUS_LABEL[status]}</p>
            <p className={`mt-1 font-mono text-2xl ${statusToken[status]}`}>{tally[status]}</p>
          </div>
        ))}
      </section>

      {domains.map((domain) => (
        <section key={domain} className="panel overflow-hidden">
          <h2 className="p-5 pb-3 text-base font-semibold">{domain}</h2>
          <div>
            {CONTROL_CATALOG.filter((control) => control.domain === domain).map((control) => (
              <ControlRow
                key={control.id}
                control={control}
                value={assessment[control.id] ?? { status: "unknown", owner: "", evidence: "" }}
                onChange={(patch) => update(control.id, patch)}
              />
            ))}
          </div>
        </section>
      ))}
    </AppShell>
  );
}

function ControlRow({
  control,
  value,
  onChange,
}: {
  control: Control;
  value: Assessment;
  onChange: (patch: Partial<Assessment>) => void;
}) {
  return (
    <div className="hairline grid gap-3 p-5 md:grid-cols-[minmax(0,1fr)_9rem_9rem_9rem] md:items-center">
      <div className="min-w-0">
        <p className="text-sm">{control.control}</p>
        <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
          {control.id} · ref {control.section}
        </p>
      </div>
      <select
        value={value.status}
        onChange={(event) => onChange({ status: event.target.value as ControlStatus })}
        className={`h-9 rounded-md border border-input bg-secondary px-2 text-sm ${statusToken[value.status]}`}
        aria-label={`Status for ${control.id}`}
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {CONTROL_STATUS_LABEL[status]}
          </option>
        ))}
      </select>
      <input
        value={value.owner}
        onChange={(event) => onChange({ owner: event.target.value })}
        placeholder="Owner"
        aria-label={`Owner for ${control.id}`}
        className="h-9 rounded-md border border-input bg-secondary px-2 text-sm placeholder:text-muted-foreground"
      />
      <input
        value={value.evidence}
        onChange={(event) => onChange({ evidence: event.target.value })}
        placeholder="Evidence"
        aria-label={`Evidence location for ${control.id}`}
        className="h-9 rounded-md border border-input bg-secondary px-2 text-sm placeholder:text-muted-foreground"
      />
    </div>
  );
}
