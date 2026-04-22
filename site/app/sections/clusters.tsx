import { BlockCard } from "../components/block-card";
import { Section } from "../components/section";
import { clusters, getItemsByLayer } from "../lib/registry";

/**
 * Clusters — the main block catalog section.
 * Iterates cluster metadata and renders one sub-section per cluster.
 * Blocks are auto-loaded from registry.json via getItemsByLayer().
 */
export function Clusters() {
  return (
    <Section
      id="blocks"
      kicker="The catalog"
      title="18 blocks. Four clusters."
    >
      <div className="flex flex-col gap-16">
        {clusters.map((cluster) => {
          const items = getItemsByLayer(cluster.layer);
          const isComingSoon = !cluster.accent;

          return (
            <div key={cluster.id} className="flex flex-col gap-6">
              <div className="flex items-baseline justify-between border-b border-[color:var(--color-bg-border)] pb-4">
                <div>
                  <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-accent)]">
                    {cluster.kicker}
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight text-[color:var(--color-fg)]">
                    {cluster.label}
                  </h3>
                </div>
                {isComingSoon && (
                  <span className="rounded-full border border-[color:var(--color-bg-border)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-fg-dim)]">
                    in development
                  </span>
                )}
              </div>

              <p className="max-w-2xl text-[13px] leading-relaxed text-[color:var(--color-fg-muted)]">
                {cluster.description}
              </p>

              {items.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <BlockCard key={item.name} item={item} accent={cluster.accent} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-[color:var(--color-bg-border)] p-8 text-center font-mono text-[12px] text-[color:var(--color-fg-dim)]">
                  blocks shipping soon — watch the repo
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
