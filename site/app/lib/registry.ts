// Loads cligentic's registry manifest at build time so landing + detail pages
// can render the real block catalog without duplicating metadata.
//
// Uses readFileSync instead of direct JSON import because Turbopack enforces
// workspace boundaries — the manifest lives at the repo root, outside site/.
// This module is server-only; the file read happens at build time for static
// pages and is cached across requests on server-rendered ones.

import { readFileSync } from "node:fs";
import { join } from "node:path";

export type RegistryItem = {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: Array<{
    path: string;
    type: string;
    target?: string;
  }>;
  docs?: string;
};

export type Registry = {
  name: string;
  homepage: string;
  items: RegistryItem[];
};

// Repo root is two levels up from site/app/lib.
const REGISTRY_PATH = join(process.cwd(), "..", "registry.json");

function loadRegistry(): Registry {
  const content = readFileSync(REGISTRY_PATH, "utf8");
  return JSON.parse(content) as Registry;
}

export const registry = loadRegistry();

export const SITE_URL = "https://cligentic.railly.dev";

/**
 * Cluster metadata — maps registry layers to the narrative clusters
 * used on the landing page.
 */
export const clusters = [
  {
    id: "cross-os",
    label: "Cross-OS without tears",
    kicker: "CLUSTER 1",
    description:
      "Open URLs, copy to clipboard, fire notifications. macOS, Linux, Windows, WSL, SSH, CI. Never throws.",
    layer: "platform",
    accent: true,
  },
  {
    id: "agent-output",
    label: "Agent-ready output",
    kicker: "CLUSTER 3",
    description:
      "`--json` dual mode. Next-step hints on stderr. The loop that lets agents operate CLIs.",
    layer: "agent",
    accent: true,
  },
  {
    id: "state",
    label: "State done right",
    kicker: "CLUSTER 2",
    description:
      "XDG paths. Atomic writes. Append-only audit logs. Config with profiles. Session tokens.",
    layer: "foundation",
    accent: true,
  },
  {
    id: "safety",
    label: "Safety flagship",
    kicker: "CLUSTER 4",
    description:
      "Killswitches. Trust ladders and intent tokens in v0.1. Battle-tested in hapi-cli.",
    layer: "safety",
    accent: true,
  },
] as const;

/**
 * Group items by layer (inferred from the file path).
 */
export function getItemsByLayer(layer: string): RegistryItem[] {
  return registry.items.filter((item) =>
    item.files.some((f) => f.path.includes(`/${layer}/`)),
  );
}

/**
 * The install command a user should copy to add a block.
 */
export function getInstallCommand(item: RegistryItem): string {
  return `bunx shadcn@latest add ${SITE_URL}/r/${item.name}.json`;
}

/**
 * The "hero" install command — the one shown on the landing.
 * We use next-steps because it's the flagship block that demonstrates
 * registryDependencies chaining (auto-pulls json-mode).
 */
export function getHeroInstallCommand(): string {
  return `bunx shadcn@latest add ${SITE_URL}/r/next-steps.json`;
}
