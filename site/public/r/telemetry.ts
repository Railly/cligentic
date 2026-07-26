// cligentic block: telemetry
//
// Anonymous usage tracking for your CLI. Opt-out by default via
// CLI_NO_TELEMETRY=1 or DO_NOT_TRACK=1 env vars. Respects user privacy.
//
// Two modes:
//   1. Local-only: append events to a JSONL file (for your own analysis)
//   2. Remote: POST events to a configurable endpoint (for hosted analytics)
//
// Usage:
//   import { trackEvent, isTelemetryEnabled } from "./foundation/telemetry";
//
//   if (isTelemetryEnabled()) {
//     trackEvent(telemetryDir, { event: "command.run", command: "deploy" });
//   }

import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export type TelemetryEvent = {
  event: string;
  command?: string;
  durationMs?: number;
  result?: "ok" | "error";
  meta?: Record<string, unknown>;
};

type StoredEvent = TelemetryEvent & {
  ts: string;
  sessionId: string;
};

export type TelemetryConfig = {
  /** Remote endpoint to POST events to. If unset, local-only mode. */
  endpoint?: string;
  /** Timeout for remote POST in ms. Default 3000. */
  timeout?: number;
};

// Session ID: random per process invocation, not per user.
// No PII. Just groups events from the same CLI run.
const sessionId = Math.random().toString(36).slice(2, 10);

/**
 * Checks if telemetry is enabled. Opt-OUT by default means telemetry
 * is ON unless the user explicitly disables it.
 *
 * Respects:
 *   - CLI_NO_TELEMETRY=1 (your app's env var, replace CLI_ with your prefix)
 *   - DO_NOT_TRACK=1 (https://consoledonottrack.com)
 *   - CI environments (always disabled in CI)
 */
export function isTelemetryEnabled(): boolean {
  if (process.env.CLI_NO_TELEMETRY === "1") return false;
  if (process.env.DO_NOT_TRACK === "1") return false;
  if (process.env.CI) return false;
  return true;
}

/**
 * Tracks an event. Appends to local JSONL and optionally POSTs to
 * a remote endpoint. Never throws. Never blocks the CLI.
 */
export function trackEvent(
  telemetryDir: string,
  event: TelemetryEvent,
  config: TelemetryConfig = {},
): void {
  if (!isTelemetryEnabled()) return;

  const stored: StoredEvent = {
    ts: new Date().toISOString(),
    sessionId,
    ...event,
  };

  // Local: append to JSONL
  try {
    mkdirSync(telemetryDir, { recursive: true });
    const file = join(telemetryDir, `${new Date().toISOString().slice(0, 10)}.jsonl`);
    appendFileSync(file, `${JSON.stringify(stored)}\n`);
  } catch {
    // never fail the CLI over telemetry
  }

  // Remote: fire-and-forget POST
  if (config.endpoint) {
    const timeout = config.timeout ?? 3000;
    fetch(config.endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(stored),
      signal: AbortSignal.timeout(timeout),
    }).catch(() => {
      // never fail the CLI over telemetry
    });
  }
}
