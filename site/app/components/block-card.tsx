import Link from "next/link";
import type { RegistryItem } from "../lib/registry";
import { ArrowUpRight } from "./arrow-icon";

type Props = {
  item: RegistryItem;
  accent?: boolean;
};

/**
 * BlockCard — one cligentic block presented as a card.
 * Shows name, description, deps, and links to its detail page.
 * Accent variant uses the brand orange border on hover.
 */
export function BlockCard({ item, accent = true }: Props) {
  const hasChain = (item.registryDependencies?.length ?? 0) > 0;

  return (
    <Link
      href={`/blocks/${item.name}`}
      className={`group relative flex flex-col justify-between rounded-lg border border-[color:var(--color-bg-border)] bg-[color:var(--color-bg-elevated)] p-6 transition-all duration-200 ${
        accent
          ? "hover:-translate-y-0.5 hover:border-[color:var(--color-accent)] hover:shadow-[0_8px_32px_-12px_var(--color-accent-glow)]"
          : "opacity-50"
      }`}
    >
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <code className="font-mono text-[13px] font-medium text-[color:var(--color-fg)] group-hover:text-[color:var(--color-accent)]">
            {item.name}
          </code>
          <ArrowUpRight
            className="text-[color:var(--color-fg-dim)] group-hover:text-[color:var(--color-accent)]"
            size={14}
          />
        </div>
        <p className="text-[13px] leading-relaxed text-[color:var(--color-fg-muted)]">
          {item.description}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[color:var(--color-bg-border)] pt-4">
        {item.dependencies && item.dependencies.length > 0 ? (
          item.dependencies.map((dep) => (
            <span
              key={dep}
              className="rounded-full border border-[color:var(--color-bg-border)] px-2 py-0.5 font-mono text-[10px] text-[color:var(--color-fg-dim)]"
            >
              {dep}
            </span>
          ))
        ) : (
          <span className="font-mono text-[10px] text-[color:var(--color-fg-dim)]">
            zero deps
          </span>
        )}
        {hasChain && (
          <span className="rounded-full bg-[color:var(--color-accent-glow)] px-2 py-0.5 font-mono text-[10px] text-[color:var(--color-accent)]">
            chained
          </span>
        )}
      </div>
    </Link>
  );
}
