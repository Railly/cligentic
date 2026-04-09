// cligentic block: detect
//
// Environment detection helpers shared across platform blocks.
// Detects OS, WSL, CI, headless environments, and binary availability.
//
// This block is auto-installed as a dependency when you add any platform
// block (open-url, copy-clipboard, notify-os). You can also install it
// standalone if you need detection helpers in your own commands.
//
// Usage:
//   import { isWsl, isCi, hasCommand, currentPlatform } from "./platform/detect";

import { existsSync, readFileSync } from "node:fs";
import { platform as osPlatform } from "node:os";

export type Platform = "darwin" | "win32" | "wsl" | "linux" | "unknown";

/**
 * Returns the current platform with WSL as a distinct value.
 * More useful than raw `process.platform` because WSL-specific
 * behavior (routing to Windows host binaries) is common in CLI code.
 */
export function currentPlatform(): Platform {
  const os = osPlatform();
  if (os === "darwin") return "darwin";
  if (os === "win32") return "win32";
  if (os === "linux" && isWsl()) return "wsl";
  if (os === "linux") return "linux";
  return "unknown";
}

/**
 * Detects WSL (Windows Subsystem for Linux). Reads /proc/version once
 * and caches the result for the lifetime of the process.
 */
let wslCache: boolean | null = null;
function isWsl(): boolean {
  if (wslCache !== null) return wslCache;
  if (osPlatform() !== "linux") {
    wslCache = false;
    return false;
  }
  try {
    const version = readFileSync("/proc/version", "utf8").toLowerCase();
    wslCache = version.includes("microsoft") || version.includes("wsl");
  } catch {
    wslCache = false;
  }
  return wslCache;
}

/**
 * Detects CI environments. Checks standard CI env vars.
 */
export function isCi(): boolean {
  return Boolean(
    process.env.CI ||
      process.env.CONTINUOUS_INTEGRATION ||
      process.env.GITHUB_ACTIONS ||
      process.env.GITLAB_CI ||
      process.env.CIRCLECI ||
      process.env.BUILDKITE,
  );
}

/**
 * Detects headless Linux (no graphical display). Common cases:
 * SSH without -X, Docker containers, CI runners.
 * WSL is NOT headless because it can open browsers on the Windows host.
 */
export function isHeadlessLinux(): boolean {
  if (osPlatform() !== "linux") return false;
  if (isWsl()) return false;
  return !process.env.DISPLAY && !process.env.WAYLAND_DISPLAY;
}

/**
 * Checks if a command exists in PATH. Cross-platform: handles Windows
 * .exe/.cmd/.bat extensions automatically. Result is not cached because
 * PATH can change between calls (rare but possible).
 */
export function hasCommand(cmd: string): boolean {
  const separator = osPlatform() === "win32" ? ";" : ":";
  const paths = (process.env.PATH || "").split(separator);
  const exts = osPlatform() === "win32" ? [".exe", ".cmd", ".bat", ""] : [""];
  for (const p of paths) {
    for (const ext of exts) {
      if (existsSync(`${p}/${cmd}${ext}`)) return true;
    }
  }
  return false;
}

// --- Output mode detection (shared by json-mode + next-steps) ---

export type OutputMode = "human" | "json";

export type EmitOptions = {
  json?: boolean;
  quiet?: boolean;
};

/**
 * Detects whether the CLI should emit structured JSON or human-readable
 * output. Used by json-mode's emit() and next-steps' emitNextSteps().
 *
 * Precedence: explicit --json flag > NO_JSON env > TTY detection > default human.
 */
export function detectMode(opts: EmitOptions = {}): OutputMode {
  if (opts.json === true) return "json";
  if (process.env.NO_JSON === "1") return "human";
  if (!process.stdout.isTTY) return "json";
  return "human";
}

/**
 * Detects whether colors should be used. Respects NO_COLOR
 * (https://no-color.org) and FORCE_COLOR env vars.
 */
export function shouldColor(): boolean {
  if (process.env.NO_COLOR) return false;
  if (process.env.FORCE_COLOR) return true;
  return Boolean(process.stdout.isTTY);
}
