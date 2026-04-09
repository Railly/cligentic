// build-registry.ts — reads registry.json, inlines each block's source into
// public/r/{name}.json, ready to serve via static hosting.
//
// This is the poor man's `shadcn build`. It exists because we want zero
// dependency on the shadcn CLI for building the registry itself — we only
// depend on it on the consumer side (bunx shadcn add ...).
//
// Usage:
//   bun scripts/build-registry.ts
//
// Output:
//   public/r/{name}.json      (one per item)
//   public/r/index.json       (the full registry index)

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

type RegistryItemFile = {
  path: string;
  type: string;
  target?: string;
  content?: string;
};

type RegistryItem = {
  $schema?: string;
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: RegistryItemFile[];
  docs?: string;
};

type Registry = {
  $schema?: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
};

const ROOT = new URL("..", import.meta.url).pathname;
const REGISTRY_PATH = join(ROOT, "registry.json");
const OUT_DIR = join(ROOT, "public", "r");

function ensureDir(file: string): void {
  mkdirSync(dirname(file), { recursive: true });
}

function main() {
  const registry: Registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf8"));
  console.log(`[cligentic] building ${registry.items.length} items...`);

  const built: RegistryItem[] = [];

  for (const item of registry.items) {
    const files: RegistryItemFile[] = item.files.map((f) => {
      const sourcePath = join(ROOT, f.path);
      const content = readFileSync(sourcePath, "utf8");
      return {
        path: f.path,
        type: f.type,
        target: f.target,
        content,
      };
    });

    const out: RegistryItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies,
      devDependencies: item.devDependencies,
      registryDependencies: item.registryDependencies,
      files,
      docs: item.docs,
    };

    // Strip undefined fields for a clean JSON output.
    const cleaned = JSON.parse(JSON.stringify(out));

    const outFile = join(OUT_DIR, `${item.name}.json`);
    ensureDir(outFile);
    writeFileSync(outFile, `${JSON.stringify(cleaned, null, 2)}\n`);
    built.push(cleaned);
    console.log(`  ✓ ${item.name} → public/r/${item.name}.json`);
  }

  // Write the index for discovery.
  const indexFile = join(OUT_DIR, "index.json");
  ensureDir(indexFile);
  writeFileSync(
    indexFile,
    `${JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema/registry.json",
        name: registry.name,
        homepage: registry.homepage,
        items: built.map((i) => ({
          name: i.name,
          type: i.type,
          title: i.title,
          description: i.description,
        })),
      },
      null,
      2,
    )}\n`,
  );
  console.log(`  ✓ index → public/r/index.json`);
  console.log(`[cligentic] done. serve with: bun scripts/serve.ts`);
}

main();
