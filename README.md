# cligentic

**Your CLI is the last thing agents touch.** Copy-paste CLI blocks for the agent era.

Trust ladders, killswitches, `--json` dual mode, audit trails. Battle-tested in CLIs shipping real money and real taxes.

→ [cligentic.railly.dev](https://cligentic.railly.dev)

## Install a block

```bash
bunx shadcn@latest add https://cligentic.railly.dev/r/next-steps.json
```

That installs `next-steps` and auto-pulls its `registryDependencies` chain (`json-mode` → `detect`). You own every line.

## Why

Every CLI I shipped to production reinvented the same primitives: cross-OS clipboard, atomic writes, audit logs, killswitches, JSON dual mode for agents. So I extracted them.

cligentic is the shadcn model applied to CLI infrastructure: a registry of copy-paste TypeScript files, no runtime dependency, no framework lock-in. Install what you need, edit it freely, ship it.

## What's in v0 (16 blocks)

| Layer | Blocks |
|---|---|
| **Platform** (cross-OS) | `detect`, `open-url`, `copy-clipboard`, `notify-os` |
| **Foundation** (state) | `xdg-paths`, `atomic-write`, `audit-log`, `config`, `session`, `error-map`, `global-flags`, `telemetry`, `banner` |
| **Agent** (output) | `json-mode`, `next-steps` |
| **Safety** | `killswitch` |

Browse them all at [cligentic.railly.dev/blocks](https://cligentic.railly.dev/blocks).

## Battle-tested provenance

Every block ships in production code before entering the registry:

- **[hapi-cli](https://github.com/crafter-station/hapi-cli)** — moves real money on Hapi Trade brokerage. `killswitch`, `audit-log`, `session`, `atomic-write`, `error-map`.
- **[sunat-cli](https://github.com/crafter-station/sunat-cli)** — emits SUNAT tax receipts in Peru. `config`, `xdg-paths`, `json-mode`, `next-steps`, `telemetry`.

Blocks copied from those repos, generalized, documented.

## Philosophy

- **Copy-paste, not npm dep.** Zero runtime dependency on cligentic.
- **Strong primitives, your wrapper.** Each block depends on focused libs (`picocolors`, `node:fs/promises`) — never on a meta-framework.
- **Agent-first by default.** `--json` mode, structured `next-steps` hints on stderr, `error-map` with actionable hints.
- **Trust ladder built in.** Dry-run → preview → execute. Killswitches halt everything in one file check.

## Stack

The blocks are pure TypeScript. The registry follows the [shadcn registry schema](https://ui.shadcn.com/docs/registry) — anything that speaks `bunx shadcn add` works.

The site is Next.js 16 + Tailwind 4 + custom Shiki theme + GSAP, deployed on Vercel.

## Local development

```bash
bun install
bun run build                    # builds registry/* into site/public/r/*.json via shadcn build
cd site && bun run dev           # serves the landing + registry on http://localhost:3000
```

To author a new block: drop the file in `registry/<layer>/<name>.ts`, add an entry to `registry.json`, run `bun run build`.

## License

MIT — see [LICENSE](LICENSE).

Built by [Railly Hugo](https://railly.dev) at [Crafter Station](https://crafterstation.com).
