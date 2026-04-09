import type { ReactNode } from "react";

/**
 * Parses backtick-wrapped segments in a plain string and returns React
 * nodes with inline <code> elements styled as accent chips.
 *
 * "Use `--json` for agents" becomes:
 *   ["Use ", <code>--json</code>, " for agents"]
 */
export function parseInlineCode(text: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded border border-[color:var(--color-bg-border)] bg-[color:var(--color-bg-elevated)] px-[0.4em] py-[0.1em] font-mono text-[0.85em] text-[color:var(--color-accent)]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
