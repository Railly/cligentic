export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="text-[15px] font-semibold tracking-tight text-[color:var(--color-fg)]">
        cligentic
      </span>
      <span
        aria-hidden
        className="inline-block h-[10px] w-[10px] translate-y-[1px] bg-[color:var(--color-accent)]"
      />
    </div>
  );
}
