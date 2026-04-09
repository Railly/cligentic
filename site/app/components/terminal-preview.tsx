import type { ReactNode } from "react";

type Props = {
  title?: string;
  stream?: "stdout" | "stderr" | "mixed";
  children: ReactNode;
};

/**
 * TerminalPreview — faux terminal window for showing command output.
 * Used in the agent-demo section to visualize stdout vs stderr separation.
 *
 * Colors by stream:
 * - stdout: plain white (it's the data, the canonical agent food)
 * - stderr: dim muted (it's logs/hints, secondary to humans)
 * - mixed: default
 */
export function TerminalPreview({ title, stream = "mixed", children }: Props) {
  const streamClass =
    stream === "stdout"
      ? "text-[color:var(--color-fg)]"
      : stream === "stderr"
        ? "text-[color:var(--color-fg-muted)]"
        : "text-[color:var(--color-fg)]";

  const borderClass =
    stream === "stdout"
      ? "border-[color:var(--color-accent)]/40"
      : stream === "stderr"
        ? "border-[color:var(--color-bg-border)]"
        : "border-[color:var(--color-bg-border)]";

  return (
    <div
      className={`overflow-hidden rounded-lg border bg-[color:var(--color-bg)] ${borderClass}`}
    >
      {title && (
        <div className="flex items-center gap-2 border-b border-[color:var(--color-bg-border)] bg-[color:var(--color-bg-elevated)] px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-bg-border)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-bg-border)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-bg-border)]" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-[color:var(--color-fg-dim)]">
            {title}
          </span>
          {stream !== "mixed" && (
            <span
              className={`ml-auto font-mono text-[10px] uppercase tracking-wider ${
                stream === "stdout"
                  ? "text-[color:var(--color-accent)]"
                  : "text-[color:var(--color-fg-dim)]"
              }`}
            >
              {stream}
            </span>
          )}
        </div>
      )}
      <pre
        className={`overflow-x-auto px-5 py-4 font-mono text-[12px] leading-relaxed ${streamClass}`}
      >
        {children}
      </pre>
    </div>
  );
}
