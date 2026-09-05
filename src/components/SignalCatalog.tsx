import { severityToken, type Signal } from "@/lib/domain";

export function SignalCatalog({ title, note, signals }: { title: string; note: string; signals: Signal[] }) {
  return (
    <section className="panel overflow-hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-2 p-5">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
          {signals.length} checks
        </p>
      </div>
      <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{note}</p>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="hairline">
            <th className="px-5 py-2 text-left font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              Code
            </th>
            <th className="px-5 py-2 text-left font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              What it detects
            </th>
            <th className="px-5 py-2 text-right font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              Severity
            </th>
          </tr>
        </thead>
        <tbody>
          {signals.map((signal) => (
            <tr key={signal.code} className="hairline align-top">
              <td className="px-5 py-3 font-mono text-xs text-foreground">{signal.code}</td>
              <td className="px-5 py-3 text-muted-foreground">{signal.detection}</td>
              <td className={`px-5 py-3 text-right font-mono text-xs ${severityToken(signal.severity)}`}>
                {signal.severity}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
