import type { Metadata } from "next";
import { BlockCard } from "../components/block-card";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { clusters, getItemsByLayer, registry } from "../lib/registry";

export const metadata: Metadata = {
  title: "All blocks",
  description:
    "Every cligentic block, grouped by cluster. Cross-OS primitives, agent-ready output, state handlers, safety flagships. All copy-paste, all yours.",
};

/**
 * /blocks — catalog index page.
 * Lists every block in the registry grouped by cluster, with counts and
 * direct links to detail pages. Secondary entry point to the catalog for
 * users arriving from search engines or direct links.
 */
export default function BlocksIndexPage() {
  const totalBlocks = registry.items.length;
  const activeClusters = clusters.filter((c) => c.accent).length;

  return (
    <main>
      <Header />

      <div className="mx-auto max-w-6xl px-10 py-16 md:px-16 md:py-24">
        <div className="mb-16 max-w-3xl">
          <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-accent)]">
            The catalog
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-[color:var(--color-fg)] md:text-6xl md:leading-[1.05] md:tracking-[-0.02em]">
            All blocks, every cluster.
          </h1>
          <p className="text-base leading-relaxed text-[color:var(--color-fg-muted)]">
            {totalBlocks} blocks shipped, {activeClusters} clusters active.
            Each block is a single file you copy into your CLI. No npm dep on
            cligentic, no framework, no lock-in.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {clusters.map((cluster) => {
            const items = getItemsByLayer(cluster.layer);

            return (
              <section key={cluster.id} id={cluster.id}>
                <div className="mb-6 flex items-baseline justify-between border-b border-[color:var(--color-bg-border)] pb-4">
                  <div>
                    <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-accent)]">
                      {cluster.kicker} · {items.length}{" "}
                      {items.length === 1 ? "block" : "blocks"}
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight text-[color:var(--color-fg)]">
                      {cluster.label}
                    </h2>
                  </div>
                  {!cluster.accent && (
                    <span className="rounded-full border border-[color:var(--color-bg-border)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-fg-dim)]">
                      in development
                    </span>
                  )}
                </div>

                <p className="mb-6 max-w-2xl text-[13px] leading-relaxed text-[color:var(--color-fg-muted)]">
                  {cluster.description}
                </p>

                {items.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <BlockCard
                        key={item.name}
                        item={item}
                        accent={cluster.accent}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-[color:var(--color-bg-border)] p-8 text-center font-mono text-[12px] text-[color:var(--color-fg-dim)]">
                    blocks shipping soon — watch the repo
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <Footer />
    </main>
  );
}
