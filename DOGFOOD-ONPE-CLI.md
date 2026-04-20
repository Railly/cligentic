# Dogfooding Report: onpe-cli

**Date:** 2026-04-19
**Author:** Railly Hugo
**Source:** Building onpe-cli (CLI for ONPE Peruvian election data) using 4 cligentic blocks

---

## Blocks Used

| Block | Layer | Used for |
|-------|-------|----------|
| `json-mode` | Agent | `emit()`, `note()`, `reportError()`, `emitSuccess()` on every command |
| `next-steps` | Agent | `emitNextSteps()` after every command completion |
| `global-flags` | Foundation | `parseGlobalFlags()` for `--json`, `--quiet`, `--verbose` normalization |
| `error-map` | Foundation | `AppError`, `mapError()` for typed errors with agent-readable hints |

---

## What Worked

### `emit()` triple signature
The `emit(data, flags, () => humanRender())` call site is clean. One place, two rendering paths, no branching in command logic. Worked exactly as designed.

### Auto-detect piped stdout
`detectMode()` checking `process.stdout.isTTY` is transparent. Running `onpe list | jq` automatically switches to JSON without `--json`. The zero-config path is the right default.

### NDJSON for arrays
Arrays emitting as one JSON object per line enables stream parsing. An agent piping `onpe candidatos --json` can process results incrementally. This matters for large election datasets.

### `next-steps` on stderr with `type: "next-step"`
Keeping hints out of stdout data territory is the right call. An agent parsing stdout gets clean data; it reads stderr only when planning the next action. The `type` field on each NDJSON line is the right discriminator.

### `error-map` `.hint` field for agent self-recovery
The pattern of attaching a runnable hint to every error code proved its value immediately. When `onpe connect` fails with `REGISTRY_DOWN`, the hint tells the agent exactly what to try next without re-planning. This is the highest-leverage field in the whole block.

### `global-flags` alias normalization
`parseGlobalFlags()` handling both `dryRun` and `dry-run`, `noInput` and `no-input`, plus `CI=true` env fallback means the same flags work from a shell, from an agent subprocess, and from CI without conditional logic in the caller.

### Zero coupling between blocks
Each block is self-contained. `error-map` has no knowledge of `json-mode`. `next-steps` imports `detectMode` from `json-mode` but nothing else. Dropping any block doesn't break the others.

---

## Issues Found

### Issue 1: `error-map` assumes string `code`, HTTP errors have numeric `status`

`extractCode()` only reads `err.code`:

```ts
function extractCode(err: unknown): string | null {
  if (err && typeof err === "object" && "code" in err) {
    return String((err as Record<string, unknown>).code);
  }
  return null;
}
```

Real HTTP errors from `fetch` don't have `.code`. They have `.status` (number), or only `.message` (string). The `Response` object is not even an `Error` instance — you have to check `res.ok` before throwing.

**Workaround used in onpe-cli:** A `toOnpeError()` adapter that pattern-matches before calling `mapError()`:

```ts
function toOnpeError(err: unknown): AppError {
  if (err instanceof Response) {
    const code = HTTP_CODE_MAP[err.status] ?? "HTTP_ERROR";
    return new AppError(code, ERRORS[code] ?? { name: "HttpError", human: `HTTP ${err.status}` });
  }
  return mapError(err, ERRORS);
}
```

**Suggestion:** Add a `fromHttp()` helper to `error-map`:

```ts
export function fromHttp(
  status: number,
  body: string,
  map: Record<number, string>,
  errors: ErrorMap,
): AppError {
  const code = map[status] ?? "HTTP_ERROR";
  const entry = errors[code] ?? { name: "HttpError", human: `HTTP ${status}: ${body}` };
  return new AppError(code, entry);
}
```

Or expand `extractCode()` to also check `.status`, `.statusCode`, `.response?.status`. The string coercion already handles it — the gap is just the lookup.

---

### Issue 2: `global-flags` has no companion argv parser for zero-dep CLIs

The block docs say:

> Pass the output of your argv parser (commander opts, citty args, etc).

This is correct and intentional. But if your CLI is zero-dep (no commander, no citty), you have no parser. onpe-cli started zero-dep, so I had to write a manual `parseArgs()`:

```ts
function parseArgs(argv: string[]) {
  const raw: Record<string, unknown> = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--json") raw.json = true;
    else if (arg === "--quiet" || arg === "-q") raw.quiet = true;
    else if (arg === "--verbose" || arg === "-v") raw.verbose = true;
    else if (arg === "--dry-run") raw.dryRun = true;
    else if (arg === "--no-input") raw.noInput = true;
    else if (arg?.startsWith("--profile=")) raw.profile = arg.split("=")[1];
  }
  return raw;
}
```

This is ~30 lines that every zero-dep CLI will reinvent.

**Suggestion:** New block `argv` (or `parse-argv`) — minimal POSIX-style argv parser, zero deps:

```ts
// cligentic block: argv
// Minimal POSIX argv parser for zero-framework CLIs.
// Handles: --flag, --flag value, --flag=value, -f, positional args.
// Returns { _: string[], [flag: string]: unknown }

export function parseArgv(argv = process.argv.slice(2)): ParsedArgs { ... }
```

This completes the "zero framework" story: install `argv` + `global-flags` + `json-mode` and you have a full agent-first CLI with no other runtime deps.

---

### Issue 3: stderr multiplexing is undocumented

In JSON mode, stderr carries two distinct channels:

1. `note()` output — suppressed (nothing written)
2. `emitNextSteps()` output — NDJSON lines tagged `type: "next-step"`

An agent consuming stderr needs to know to filter by `type` field. If it reads raw stderr expecting only `next-step` objects, any non-suppressed note will break JSON.parse. The code handles this correctly but the docs don't state the contract explicitly.

The `next-steps` block has a code comment showing this:

```ts
// const steps = readStderr(proc)
//   .split("\n")
//   .filter(Boolean)
//   .map(line => JSON.parse(line))
//   .filter(obj => obj.type === "next-step");
```

That's the right pattern, but it's buried in a comment, not in a docs section.

**Suggestion:** Add a "stderr protocol" section to both `json-mode` and `next-steps` docs:

> In JSON mode, stdout is pure data. stderr is a multiplexed channel. Lines written by `note()` are suppressed. Lines written by `emitNextSteps()` are NDJSON objects tagged `{ type: "next-step", ... }`. Any agent parsing stderr MUST filter by `type` before calling `JSON.parse`.

---

### Issue 4: No `doctor` block for health-check commands

onpe-cli has an `onpe doctor` command. sunat-cli has one too. The pattern is identical:

```
onpe doctor
  ✓ ONPE registry reachable  (200 OK in 124ms)
  ✓ Local cache valid         (2026-04-18, 1043 records)
  ✗ Auth token                expired — run: onpe auth login
```

The implementation is always the same shape: an array of `{ name, ok, detail }` checks, run sequentially or in parallel, exit code 0/1, JSON-serializable result. Every CLI I've built has written this from scratch.

**Suggestion:** New block `doctor`:

```ts
// cligentic block: doctor
// Health-check pattern. Run named checks, emit structured results,
// exit non-zero if any check fails.

export type DoctorCheck = {
  name: string;
  ok: boolean;
  detail: string;
};

export type DoctorResult = {
  ok: boolean;
  checks: DoctorCheck[];
};

export async function runDoctor(
  checks: Array<() => Promise<DoctorCheck>>,
): Promise<DoctorResult> { ... }

export function renderDoctor(result: DoctorResult, opts: EmitOptions): void { ... }
```

Usage:

```ts
const result = await runDoctor([
  async () => checkRegistryReachable(),
  async () => checkLocalCache(),
  async () => checkAuthToken(),
]);
renderDoctor(result, flags);
process.exit(result.ok ? 0 : 1);
```

`renderDoctor` delegates to `emit()` for JSON mode, so agents get a structured `{ ok, checks }` object. Humans get the checkmark table. Exit code carries the verdict.

---

## Summary

| Block | Verdict | Gap |
|-------|---------|-----|
| `json-mode` | Works great | None |
| `next-steps` | Works great | Document stderr multiplexing contract |
| `global-flags` | Works, gap | Needs companion `argv` block for zero-dep CLIs |
| `error-map` | Works, gap | Needs HTTP error extraction (`fromHttp` helper or `.status` check) |

## New Block Candidates

| Block | Priority | Rationale |
|-------|----------|-----------|
| `argv` | High | Completes zero-dep story; needed in onpe-cli and every new CLI |
| `doctor` | Medium | Pattern repeated verbatim across sunat-cli, onpe-cli, hapi-cli |
