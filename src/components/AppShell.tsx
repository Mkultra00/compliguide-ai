import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { VoiceConsole } from "./VoiceConsole";

const nav = [
  { to: "/", label: "Risk queue" },
  { to: "/screening", label: "Screening" },
  { to: "/advisory", label: "Advisory" },
  { to: "/controls", label: "Control gaps" },
  { to: "/briefing", label: "Briefing visuals" },
] as const;

export function AppShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-4">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-mono text-xs tracking-[0.28em] text-muted-foreground">BLACK CHAMBER</span>
            <span className="font-display text-base font-semibold tracking-tight">Review</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[status=active]:bg-accent data-[status=active]:text-accent-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0">
          <p className="label-eyebrow">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{intro}</p>
          <div className="mt-8 space-y-6">{children}</div>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <VoiceConsole />
        </aside>
      </main>

      <footer className="mx-auto max-w-7xl px-6 pb-10">
        <p className="hairline pt-4 font-mono text-xs leading-relaxed text-muted-foreground">
          This system produces evidence and recommendations for human review. It does not act on any source
          system and it is not legal advice. Applicability of any obligation depends on charter, jurisdiction,
          product and customer base.
        </p>
      </footer>
    </div>
  );
}
