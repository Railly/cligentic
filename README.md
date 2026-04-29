# cligentic

Agents need CLIs with safe execution surfaces. cligentic ships the primitives (trust ladders, killswitches, audit logs, `--json` dual mode) as copy-paste TypeScript blocks you own completely.

```bash
bunx shadcn@latest add https://cligentic.railly.dev/r/trust-ladder.json
```

## Why

Every CLI I shipped to production reinvented the same primitives: trust gates, atomic writes, killswitches, JSON dual mode, audit trails. cligentic extracts them.

shadcn model applied to CLI infrastructure. No runtime dependency, no framework lock-in. Install what you need, edit it freely, ship it.

## Install one block

```bash
bunx shadcn@latest add https://cligentic.railly.dev/r/trust-ladder.json
```

This drops into your project:

```
src/agent/
  trust-ladder.ts     # TrustLevel enum (T0-T3) + approveGate() + renderPreview()
  json-mode.ts        # --json flag detection + structured emit helpers
  error-map.ts        # AppError with human message + actionable hint
```

`approveGate()` is the core: T0/T1 pass through silently, T2 prompts for confirmation, T3 requires `--yes --confirm <id>`. In `--json` mode or piped input, any T2+ gate throws instead of prompting, so agents get a structured error, not a hanging prompt.

```ts
await approveGate(ctx, preview, { trust: "T2", yes: flags.yes });
await placeOrder(order); // only runs if approved
```

## Available blocks

### Agent
| Block | Description |
|---|---|
| `trust-ladder` | T0-T3 approval gate + preview renderer. The core safety primitive. |
| `killswitch` | File-based emergency stop. `~/.app/KILLSWITCH` exists → all writes blocked. |
| `json-mode` | `--json` flag detection + structured stdout/stderr emit helpers. |
| `next-steps` | Structured `nextSteps` hints on stderr. Tells agents what to run next. |
| `doctor` | Pre-flight environment check (deps, auth, connectivity). |
| `api-key-wizard` | Interactive API key setup with validation and secure storage. |
| `skill-installer-prompt` | Prompt to install Claude Code / Cursor skills from your CLI. |

### Foundation
| Block | Description |
|---|---|
| `audit-log` | Append-only JSONL logger for every write operation. |
| `audit-lifecycle` | Session start/end wrappers around the audit log. |
| `atomic-write` | Write to temp file, rename to target. No partial writes. |
| `xdg-paths` | XDG Base Directory paths (`~/.config`, `~/.local/share`, `~/.cache`). |
| `config` | JSON config file reader/writer on top of `xdg-paths`. |
| `session` | Session ID generation and tracking. |
| `error-map` | `AppError` with structured `code`, human message, and actionable hint. |
| `argv` | Minimal argv parser without a framework dep. |
| `global-flags` | Standard flags (`--json`, `--yes`, `--dry-run`, `--verbose`). |
| `telemetry` | Opt-in telemetry with local consent file. |
| `banner` | CLI startup banner with version + mode. |

### Platform
| Block | Description |
|---|---|
| `detect` | Detect OS, shell, and package manager. |
| `open-url` | Cross-OS `open`/`xdg-open`/`start` wrapper. |
| `copy-clipboard` | Cross-OS clipboard write. |
| `notify-os` | Desktop notification via `osascript` / `notify-send` / `powershell`. |

Browse all at [cligentic.railly.dev/blocks](https://cligentic.railly.dev/blocks).

## Used in production

- **broker-cli** (private). Agent-first brokerage CLI, moves real money. Uses `killswitch`, `audit-log`, `session`, `atomic-write`, `trust-ladder`.
- **[v0-cli](https://github.com/Railly/v0-cli)**. Agent-first v0 Platform API wrapper. Uses `audit-log`, `killswitch`, `doctor`, `next-steps`, `api-key-wizard`.
- **[sunat-cli](https://github.com/crafter-station/sunat-cli)**. Agent-first SUNAT tax automation. Uses `config`, `xdg-paths`, `json-mode`, `next-steps`, `telemetry`.
- **[webctl](https://github.com/crafter-station/webctl)**. Reverse-engineers websites into agent CLIs. Uses `xdg-paths`, `config`, `session`.

## Stack

Blocks are pure TypeScript. Registry follows the [shadcn registry schema](https://ui.shadcn.com/docs/registry). Anything that speaks `bunx shadcn add` works.

The site is Next.js + Tailwind 4 + Shiki, deployed on Vercel.

## Local development

```bash
bun install
bun run build          # builds registry/* into site/public/r/*.json
cd site && bun run dev # http://localhost:3000
```

To add a block: drop the file in `registry/<layer>/<name>.ts`, add an entry to `registry.json`, run `bun run build`.

## License

MIT. See [LICENSE](LICENSE).

Built by [Railly Hugo](https://railly.dev) at [Crafter Station](https://crafterstation.com).
