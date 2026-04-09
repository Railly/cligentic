import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlockSource } from "../../components/block-source";
import { CopyCommand } from "../../components/copy-command";
import { Footer } from "../../components/footer";
import { Header } from "../../components/header";
import { getInstallCommand, registry } from "../../lib/registry";

type Props = {
  params: Promise<{ name: string }>;
};

export async function generateStaticParams() {
  return registry.items.map((item) => ({ name: item.name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const item = registry.items.find((i) => i.name === name);
  if (!item) return {};
  return {
    title: `${item.name} | ${item.title ?? item.name}`,
    description: item.description,
    openGraph: {
      title: `${item.name} | cligentic block`,
      description: item.description,
    },
  };
}

/**
 * Static map of block name → MDX module loader. Using a static map
 * instead of a dynamic template import keeps Turbopack happy — it can
 * statically analyze which files to bundle. Add a new entry here when
 * shipping a new block.
 */
const blockContent: Record<
  string,
  () => Promise<{ default: React.ComponentType }>
> = {
  "open-url": () => import("../../../content/blocks/open-url.mdx"),
  "json-mode": () => import("../../../content/blocks/json-mode.mdx"),
  "next-steps": () => import("../../../content/blocks/next-steps.mdx"),
  "detect": () => import("../../../content/blocks/detect.mdx"),
  "copy-clipboard": () => import("../../../content/blocks/copy-clipboard.mdx"),
  "notify-os": () => import("../../../content/blocks/notify-os.mdx"),
  "killswitch": () => import("../../../content/blocks/killswitch.mdx"),
  "banner": () => import("../../../content/blocks/banner.mdx"),
  "config": () => import("../../../content/blocks/config.mdx"),
  "session": () => import("../../../content/blocks/session.mdx"),
  "error-map": () => import("../../../content/blocks/error-map.mdx"),
  "global-flags": () => import("../../../content/blocks/global-flags.mdx"),
  "telemetry": () => import("../../../content/blocks/telemetry.mdx"),
  "xdg-paths": () => import("../../../content/blocks/xdg-paths.mdx"),
  "atomic-write": () => import("../../../content/blocks/atomic-write.mdx"),
  "audit-log": () => import("../../../content/blocks/audit-log.mdx"),
};

async function loadBlockContent(name: string) {
  const loader = blockContent[name];
  if (!loader) return null;
  try {
    const mod = await loader();
    return mod.default;
  } catch {
    return null;
  }
}

/**
 * Loads the full source of a block from the registry workspace.
 * Reads synchronously at render time — the files are small (<500 LOC)
 * and static across the build.
 */
function loadBlockSource(relativePath: string): string {
  const abs = join(process.cwd(), "..", relativePath);
  return readFileSync(abs, "utf8");
}

export default async function BlockDetailPage({ params }: Props) {
  const { name } = await params;
  const item = registry.items.find((i) => i.name === name);
  if (!item) return notFound();

  const installCmd = getInstallCommand(item);
  const hasChain = (item.registryDependencies?.length ?? 0) > 0;

  const Content = await loadBlockContent(name);
  const sourcePath = item.files[0]?.path ?? "";
  const source = sourcePath ? loadBlockSource(sourcePath) : "";
  const sourceLines = source.split("\n").length;
  const targetPath = item.files[0]?.target ?? "";

  return (
    <main>
      <Header />

      <div className="mx-auto max-w-4xl px-10 pb-24 pt-16 md:px-16">
        <Link
          href="/blocks"
          className="mb-10 inline-flex items-center gap-2 font-mono text-[12px] text-[color:var(--color-fg-dim)] hover:text-[color:var(--color-accent)]"
        >
          ← back to catalog
        </Link>

        <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-accent)]">
          cligentic block
        </div>

        <h1 className="mb-6 font-mono text-4xl font-bold tracking-tight text-[color:var(--color-fg)] md:text-5xl">
          {item.name}
        </h1>

        <p className="mb-10 max-w-2xl text-base leading-relaxed text-[color:var(--color-fg-muted)]">
          {item.description}
        </p>

        {/* Install command */}
        <div className="mb-14 max-w-full">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-fg-dim)]">
            Install
          </div>
          <CopyCommand command={installCmd} variant="inline" />
        </div>

        {/* Meta grid — npm deps + block deps + size */}
        <div className="mb-14 grid gap-10 border-y border-[color:var(--color-bg-border)] py-8 md:grid-cols-3">
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-fg-dim)]">
              NPM dependencies
            </div>
            {item.dependencies && item.dependencies.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {item.dependencies.map((dep) => (
                  <li
                    key={dep}
                    className="rounded-full border border-[color:var(--color-bg-border)] px-3 py-1 font-mono text-[11px] text-[color:var(--color-fg)]"
                  >
                    {dep}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-mono text-[12px] text-[color:var(--color-fg-dim)]">
                zero deps — pure TS
              </p>
            )}
          </div>

          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-fg-dim)]">
              Block dependencies
            </div>
            {hasChain ? (
              <ul className="flex flex-wrap gap-2">
                {item.registryDependencies?.map((dep) => {
                  const chainedName =
                    dep.split("/").pop()?.replace(".json", "") ?? dep;
                  return (
                    <li key={dep}>
                      <Link
                        href={`/blocks/${chainedName}`}
                        className="rounded-full border border-[color:var(--color-accent)] px-3 py-1 font-mono text-[11px] text-[color:var(--color-accent)] hover:bg-[color:var(--color-accent-glow)]"
                      >
                        {chainedName}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="font-mono text-[12px] text-[color:var(--color-fg-dim)]">
                standalone
              </p>
            )}
          </div>

          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-fg-dim)]">
              Size
            </div>
            <p className="font-mono text-[12px] text-[color:var(--color-fg)]">
              {sourceLines} LOC
            </p>
          </div>
        </div>

        {/* MDX content — rich docs with internal code blocks */}
        {Content && (
          <article className="mdx-article">
            <Content />
          </article>
        )}

        {/* Full source — always at the end, for reading */}
        {source && (
          <section className="mt-20 border-t border-[color:var(--color-bg-border)] pt-12">
            <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-accent)]">
              Source
            </div>
            <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[color:var(--color-fg)]">
              The full file, {sourceLines} lines.
            </h2>
            <p className="mb-6 max-w-2xl text-[14px] leading-relaxed text-[color:var(--color-fg-muted)]">
              This is the exact TypeScript that lands in your project when you
              run the install command. Read it, copy it, edit it, own it.
              cligentic never touches it again.
            </p>
            <BlockSource
              code={source}
              lang="typescript"
              filename={targetPath}
            />
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
