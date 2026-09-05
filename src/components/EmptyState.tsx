export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="panel flex flex-col items-start gap-2 p-8">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary font-mono text-xs text-muted-foreground">
        0
      </div>
      <h3 className="mt-2 text-base font-semibold">{title}</h3>
      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
