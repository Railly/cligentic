# cligentic

**Copy-paste CLI blocks for the agent era. Own your primitives.**

A shadcn-style registry of production-tested CLI blocks extracted from
real CLIs shipping real consequences — brokerage orders in hapi-cli,
SUNAT tax filings in sunat-cli, audio transcription in trx.

Install individual blocks into your CLI project with `bunx shadcn add`,
own the code from day one, customize it to your brand.

## Status

v0 in development. Not yet published. First block prototype: `open-url`.

## Philosophy

- **Copy-paste, not npm dep.** You own the code. No runtime dep on cligentic.
- **Strong primitives empaquetadas.** Blocks use `@clack/prompts`, `citty`,
  `picocolors`, `c12` as npm deps — same way shadcn/ui uses Radix. The
  opinion lives in the wrapper you copy.
- **Agent-first from day one.** `--json` dual mode, trust ladders,
  intent tokens, MCP servers — the patterns that make CLIs safe for
  agents to operate.
- **Battle-tested, not greenfield.** Every block ships in at least one
  production CLI before it enters the registry.

## Layers

| Layer | What it covers |
|---|---|
| **0. Platform** | Cross-OS primitives: open-url, clipboard, notifications, paths |
| **1. Foundation** | State, config, session, output, errors, entry scaffold |
| **2. Agent** | json-mode, next-steps, introspection, MCP server, skill installer |
| **3. Safety** | trust-ladder, killswitch, ledger, approvals, intent tokens |
| **4. Service** | rsa-oaep-login, otp-flow, hmac-signing (reverse-engineering helpers) |

## v0 blocks (shipping first)

11 blocks across 4 clusters:

**Cross-OS** — open-url, copy-clipboard, notify-os, which-bin
**State** — xdg-paths, atomic-write, audit-log
**Agent-output** — json-mode, next-steps
**Safety flagship** — killswitch
**Branding** — banner

## License

MIT
