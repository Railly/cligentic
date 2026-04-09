// cligentic block: open-url
//
// Opens a URL in the user's default browser, across macOS, Linux, Windows,
// WSL, SSH sessions, and headless CI environments.
//
// Design rules:
//   1. Respect BROWSER env var first (Unix convention).
//   2. Detect WSL and route through wslview / explorer.exe.
//   3. Detect headless (no DISPLAY on Linux, SSH without X forwarding).
//   4. Fall back to printing the URL and letting the user click it.
//   5. Never throw — return a verdict so callers can decide what to do.
//   6. Never block — spawn detached so long-lived CLIs don't hang.
//
// Usage:
//   import { openUrl } from "./platform/open-url";
//
//   const result = await openUrl("https://cligentic.crafter.run");
//   if (result.opened === false) {
//     console.log("Please open this URL manually:", result.url);
//   }
//
// Tested on: macOS 14, Ubuntu 22, WSL2 Ubuntu, Windows 11, GitHub Actions.

import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { platform } from "node:os";

export type OpenUrlResult = {
  url: string;
  opened: boolean;
  via: "browser-env" | "darwin" | "wsl" | "linux" | "windows" | "manual";
  reason?: string;
};

export type OpenUrlOptions = {
  /** If true, never actually spawn — just return what would happen. */
  dryRun?: boolean;
  /** If true, force the manual fallback (print-only). */
  manualOnly?: boolean;
};

/**
 * Detects whether the current process is running inside WSL (Windows
 * Subsystem for Linux). WSL1 and WSL2 both expose this via /proc/version.
 */
function isWsl(): boolean {
  if (platform() !== "linux") return false;
  try {
    const version = readFileSync("/proc/version", "utf8").toLowerCase();
    return version.includes("microsoft") || version.includes("wsl");
  } catch {
    return false;
  }
}

/**
 * Detects whether the Linux environment is headless (no graphical display).
 * Common cases: SSH without -X, docker containers, CI runners.
 */
function isHeadlessLinux(): boolean {
  if (platform() !== "linux") return false;
  if (isWsl()) return false; // WSL can open browsers on the Windows host
  return !process.env.DISPLAY && !process.env.WAYLAND_DISPLAY;
}

/**
 * Detects whether we're running inside a CI environment.
 */
function isCi(): boolean {
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
 * Checks if a command exists in PATH, cross-platform.
 */
function hasCommand(cmd: string): boolean {
  const paths = (process.env.PATH || "").split(platform() === "win32" ? ";" : ":");
  const exts = platform() === "win32" ? [".exe", ".cmd", ".bat", ""] : [""];
  for (const p of paths) {
    for (const ext of exts) {
      if (existsSync(`${p}/${cmd}${ext}`)) return true;
    }
  }
  return false;
}

/**
 * Spawns a detached command so the parent CLI doesn't block on the browser.
 */
function spawnDetached(cmd: string, args: string[]): void {
  const child = spawn(cmd, args, {
    detached: true,
    stdio: "ignore",
    shell: false,
  });
  child.unref();
}

/**
 * Opens a URL in the user's default browser.
 *
 * Returns a structured result instead of throwing. Callers can check
 * `result.opened` and decide whether to print a manual fallback.
 */
export async function openUrl(
  url: string,
  options: OpenUrlOptions = {},
): Promise<OpenUrlResult> {
  const { dryRun = false, manualOnly = false } = options;

  // Manual override or known-headless environment.
  if (manualOnly || isCi() || isHeadlessLinux()) {
    return {
      url,
      opened: false,
      via: "manual",
      reason: manualOnly
        ? "manualOnly flag set"
        : isCi()
          ? "CI environment detected"
          : "headless Linux (no DISPLAY / WAYLAND_DISPLAY)",
    };
  }

  // Respect BROWSER env var — standard on Unix.
  const browserEnv = process.env.BROWSER;
  if (browserEnv && browserEnv !== "none") {
    if (dryRun) {
      return { url, opened: true, via: "browser-env", reason: `would run: ${browserEnv} ${url}` };
    }
    try {
      spawnDetached(browserEnv, [url]);
      return { url, opened: true, via: "browser-env" };
    } catch (err) {
      // fall through to platform-specific path
    }
  }

  const os = platform();

  // macOS: `open` is always present.
  if (os === "darwin") {
    if (dryRun) return { url, opened: true, via: "darwin", reason: `would run: open ${url}` };
    try {
      spawnDetached("open", [url]);
      return { url, opened: true, via: "darwin" };
    } catch (err) {
      return {
        url,
        opened: false,
        via: "manual",
        reason: `open failed: ${(err as Error).message}`,
      };
    }
  }

  // Windows (native): use PowerShell `Start-Process` — more reliable
  // than `start` because it doesn't need a cmd shell.
  if (os === "win32") {
    if (dryRun) {
      return {
        url,
        opened: true,
        via: "windows",
        reason: `would run: powershell Start-Process ${url}`,
      };
    }
    try {
      spawnDetached("powershell.exe", ["-NoProfile", "-Command", `Start-Process "${url}"`]);
      return { url, opened: true, via: "windows" };
    } catch (err) {
      return {
        url,
        opened: false,
        via: "manual",
        reason: `powershell failed: ${(err as Error).message}`,
      };
    }
  }

  // WSL: open on the Windows host via wslview (preferred) or cmd.exe.
  if (isWsl()) {
    if (hasCommand("wslview")) {
      if (dryRun) return { url, opened: true, via: "wsl", reason: `would run: wslview ${url}` };
      try {
        spawnDetached("wslview", [url]);
        return { url, opened: true, via: "wsl" };
      } catch {
        // fall through
      }
    }
    // cmd.exe /c start requires URL quoting with empty first arg.
    if (hasCommand("cmd.exe")) {
      if (dryRun) {
        return { url, opened: true, via: "wsl", reason: `would run: cmd.exe /c start ${url}` };
      }
      try {
        spawnDetached("cmd.exe", ["/c", "start", "", url]);
        return { url, opened: true, via: "wsl" };
      } catch (err) {
        return {
          url,
          opened: false,
          via: "manual",
          reason: `wsl cmd.exe failed: ${(err as Error).message}`,
        };
      }
    }
    return {
      url,
      opened: false,
      via: "manual",
      reason: "WSL without wslview or cmd.exe",
    };
  }

  // Linux: try xdg-open → gio → sensible-browser → firefox/chrome.
  const candidates = ["xdg-open", "gio", "sensible-browser", "firefox", "google-chrome", "chromium"];
  for (const cmd of candidates) {
    if (hasCommand(cmd)) {
      if (dryRun) return { url, opened: true, via: "linux", reason: `would run: ${cmd} ${url}` };
      try {
        const args = cmd === "gio" ? ["open", url] : [url];
        spawnDetached(cmd, args);
        return { url, opened: true, via: "linux" };
      } catch {
        // try the next candidate
      }
    }
  }

  return {
    url,
    opened: false,
    via: "manual",
    reason: "no known browser opener found on PATH",
  };
}
