import { readFileSync } from "node:fs";
import { join } from "node:path";
import { type BundledLanguage, codeToHtml } from "shiki";

/**
 * BlockSource — server component that renders the full source file of a
 * cligentic block with Shiki syntax highlighting. Used at the bottom of
 * each block detail page so readers can inspect the exact code they'll
 * be copying.
 *
 * Shares the same `cligentic-noir` theme as the rest of the site by
 * loading it from the JSON file that rehype-pretty-code also reads.
 * Single source of truth — edit the JSON and both highlighting paths
 * update together.
 *
 * No animations. Source code is for reading, not watching.
 */

type Props = {
  code: string;
  lang?: BundledLanguage;
  filename?: string;
};

// Module-level theme cache — read once, reuse across renders.
let themeCache: Record<string, unknown> | null = null;
function loadTheme(): Record<string, unknown> {
  if (!themeCache) {
    const themePath = join(
      process.cwd(),
      "public",
      "shiki",
      "cligentic-noir.json",
    );
    themeCache = JSON.parse(readFileSync(themePath, "utf8"));
  }
  return themeCache as Record<string, unknown>;
}

export async function BlockSource({
  code,
  lang = "typescript",
  filename,
}: Props) {
  const theme = loadTheme();

  // biome-ignore lint/suspicious/noExplicitAny: Shiki theme type is complex
  const html = await codeToHtml(code, { lang, theme: theme as any });

  return (
    <div className="overflow-hidden rounded-lg border border-[color:var(--color-bg-border)] bg-[color:var(--color-bg)]">
      {filename && (
        <div className="flex items-center gap-2 border-b border-[color:var(--color-bg-border)] bg-[color:var(--color-bg-elevated)] px-5 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-bg-border)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-bg-border)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-bg-border)]" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-[color:var(--color-fg-dim)]">
            {filename}
          </span>
        </div>
      )}
      <div
        className="block-source-body"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is trusted
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
