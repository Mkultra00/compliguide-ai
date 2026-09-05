import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { recommendations } from "@/lib/domain";

export const Route = createFileRoute("/advisory")({
  head: () => ({
    meta: [
      { title: "Advisory · Black Chamber Review" },
      {
        name: "description",
        content:
          "Case-level recommendations with citations and no write access to source systems. The assistant recommends; a person decides and signs.",
      },
      { property: "og:title", content: "Advisory · Black Chamber Review" },
      {
        property: "og:description",
        content: "Case-level recommendations with citations, and no ability to act on any source system.",
      },
    ],
  }),
  component: Advisory;
});

const principles = [
  {
    title: "It recommends, it never acts",
    body: "There is no path from this app to a source system. No revoke, no rotate, no disable, no account change. Restricting what the tools can do is the only defence against a manipulated instruction that actually holds.",
  },
  {
    title: "Every figure is looked up",
    body: "The assistant does not produce a number, a name, a date or a count from memory. If it says something factual, it read it from the record, and the record is shown next to the answer.",
  },
  {
    title: "Every recommendation carries a citation",
    body: "A suggestion with no source is an opinion. Each one points at the rule, guidance or internal policy it comes from, and states plainly that it is not legal advice.",
  },
  {
    title: "It declines out-of-scope questions",
    body: "A general-purpose assistant gives a reviewer no sense of what it is for, and they stop trusting it. Narrow scope, stated openly, is what makes it usable.",
  },
];

function Advisory() {
  return (
    <AppShell
      eyebrow="Advisory"
      title="Recommendations"
      intro="Suggested next steps attached to individual cases. Written to be read by a reviewer who has to defend the decision later."
    >
      {recommendations.length === 0 ? (
        <EmptyState
          title="No recommendations yet"
          body="Recommendations are generated per case once your data is loaded, and each one arrives with the evidence it rests on and the source it cites."
        />
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2">
        {principles.map((principle) => (
          <article key={principle.title} className="panel p-5">
            <h2 className="text-base font-semibold">{principle.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
