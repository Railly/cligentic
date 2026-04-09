// cligentic block: json-mode
//
// Dual-rendering output helpers for CLIs that serve both humans and agents.
//
// Design rules:
//   1. stdout is data — the primary signal agents consume. Only structured
//      JSON goes here in --json mode. In human mode, formatted output.
//   2. stderr is logs — notes, progress, errors. Never parsed by the agent
//      as data (but may be parsed as next-step hints — see next-steps block).
//   3. Mode detection is implicit. If stdout is piped (not TTY), auto-switch
//      to JSON. If --json flag is set, force JSON regardless. If NO_COLOR is
//      set, suppress colors in human mode.
//   4. Never call process.exit(). The author decides when to exit.
//   5. One call site, two outputs. `emit(value, opts, humanRender?)` is the
//      single entry point — it decides which path to take based on opts.
//
// Usage:
//   import { detectMode, emit, note, reportError } from "./agent/json-mode";
//
//   program.option("--json", "emit JSON for agents");
//
//   program.command("list").action(async (opts) => {
//     const items = await fetchItems();
//     emit(items, opts, (data) => {
//       for (const item of data) {
//         console.log(`- ${item.name} (${item.id})`);
//       }
//     });
//   });
//
//   // In json mode: stdout gets `[{"name":"foo","id":1},...]`
//   // In human mode: stdout gets the bulleted list
//   // Either way, errors go to stderr, never mixed with data.
//
// Depends on:
//   - picocolors (for human-mode coloring)

import pc from "picocolors";

export type Mode = "human" | "json";

export type EmitOptions = {
  /** Set when --json flag is present on the command. */
  json?: boolean;
  /** Set when --quiet flag is present — suppresses notes in human mode. */
  quiet?: boolean;
};

/**
 * Detects whether the current invocation should emit structured JSON
 * or human-readable output.
 *
 * Precedence (highest wins):
 *   1. Explicit --json flag → "json"
 *   2. stdout is not a TTY (piped / redirected) → "json"
 *   3. NO_JSON env var → force "human"
 *   4. Default → "human"
 */
export function detectMode(opts: EmitOptions = {}): Mode {
  if (opts.json === true) return "json";
  if (process.env.NO_JSON === "1") return "human";
  if (!process.stdout.isTTY) return "json";
  return "human";
}

/**
 * Detects whether colors should be used in human-mode output.
 * Respects NO_COLOR (https://no-color.org) and FORCE_COLOR env vars.
 */
export function shouldColor(): boolean {
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR) return true;
  return Boolean(process.stdout.isTTY);
}

/**
 * Emits a value to stdout. In json mode, stringifies as JSON. In human mode,
 * calls the provided humanRender callback, or falls back to JSON.stringify
 * with indentation.
 *
 * Rules:
 *   - stdout only. Never stderr.
 *   - Arrays in json mode emit as NDJSON (one object per line) so agents
 *     can stream-parse. Objects emit as single JSON lines.
 *   - humanRender is only called in human mode. It should console.log
 *     directly — emit does not capture its output.
 */
export function emit<T>(value: T, opts: EmitOptions = {}, humanRender?: (value: T) => void): void {
  const mode = detectMode(opts);

  if (mode === "json") {
    if (Array.isArray(value)) {
      for (const item of value) {
        process.stdout.write(`${JSON.stringify(item)}\n`);
      }
    } else {
      process.stdout.write(`${JSON.stringify(value)}\n`);
    }
    return;
  }

  // Human mode.
  if (humanRender) {
    humanRender(value);
    return;
  }

  // Fallback: pretty-printed JSON to stdout.
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

/**
 * Writes a note to stderr. Notes are human guidance — "fetching...",
 * "using profile X", etc. In json mode, notes are suppressed entirely
 * (stderr stays clean for next-steps NDJSON). In quiet mode, also suppressed.
 */
export function note(message: string, opts: EmitOptions = {}): void {
  if (opts.json === true) return;
  if (!process.stdout.isTTY && opts.json !== false) return;
  if (opts.quiet) return;

  const colored = shouldColor() ? pc.dim(message) : message;
  process.stderr.write(`${colored}\n`);
}

/**
 * Writes a success message to stderr (in human mode) or emits a structured
 * success object to stdout (in json mode).
 */
export function emitSuccess(message: string, opts: EmitOptions = {}): void {
  const mode = detectMode(opts);
  if (mode === "json") {
    process.stdout.write(`${JSON.stringify({ ok: true, message })}\n`);
    return;
  }
  const prefix = shouldColor() ? pc.green("✓") : "✓";
  process.stderr.write(`${prefix} ${message}\n`);
}

/**
 * Reports an error. In json mode: structured error object to stdout (so
 * agents can parse it). In human mode: colored message to stderr.
 *
 * Does NOT call process.exit() — the caller decides whether to exit and
 * with what code. This block only handles rendering.
 *
 * Returns the structured error payload so callers can inspect / re-emit.
 */
export function reportError(
  error: string | Error,
  opts: EmitOptions = {},
): { ok: false; error: string; stack?: string } {
  const message = error instanceof Error ? error.message : error;
  const stack = error instanceof Error ? error.stack : undefined;
  const payload = { ok: false as const, error: message, ...(stack ? { stack } : {}) };

  const mode = detectMode(opts);
  if (mode === "json") {
    process.stdout.write(`${JSON.stringify(payload)}\n`);
    return payload;
  }

  const prefix = shouldColor() ? pc.red("✗") : "✗";
  process.stderr.write(`${prefix} ${message}\n`);
  if (stack && process.env.DEBUG) {
    process.stderr.write(`${shouldColor() ? pc.dim(stack) : stack}\n`);
  }
  return payload;
}
