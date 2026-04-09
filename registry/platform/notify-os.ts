// cligentic block: notify-os
//
// Fires a system notification across macOS, Linux, Windows, and WSL.
// Returns a typed verdict instead of throwing.
//
// Design rules:
//   1. Detect the notification backend automatically.
//   2. macOS uses osascript display notification.
//   3. Linux uses notify-send (libnotify).
//   4. Windows/WSL uses PowerShell BurntToast or msg fallback.
//   5. CI/headless: returns silently (no error, just skipped).
//   6. Never throws. Returns { sent, via, reason? }.
//
// Usage:
//   import { notifyOs } from "./platform/notify-os";
//
//   const result = await notifyOs("Deploy complete", "myapp v1.2.0 is live");
//   // On macOS: system notification bubble appears
//   // On CI: result.sent === false, result.via === "skipped"

import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { platform } from "node:os";

export type NotifyResult = {
  sent: boolean;
  via: "osascript" | "notify-send" | "powershell" | "skipped";
  reason?: string;
};

export type NotifyOptions = {
  dryRun?: boolean;
  /** App name shown in the notification. Defaults to "CLI". */
  appName?: string;
  /** Sound on macOS. Set false to suppress. */
  sound?: boolean;
};

function isWsl(): boolean {
  if (platform() !== "linux") return false;
  try {
    return readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft");
  } catch {
    return false;
  }
}

function isCi(): boolean {
  return Boolean(
    process.env.CI ||
      process.env.CONTINUOUS_INTEGRATION ||
      process.env.GITHUB_ACTIONS ||
      process.env.GITLAB_CI,
  );
}

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

function escapeOsascript(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

/**
 * Fires a system notification.
 *
 * Returns a typed verdict. Never throws. In CI or headless environments
 * the notification is silently skipped (not an error).
 */
export async function notifyOs(
  title: string,
  message: string,
  options: NotifyOptions = {},
): Promise<NotifyResult> {
  const { dryRun = false, appName = "CLI", sound = true } = options;
  const os = platform();

  if (isCi()) {
    return { sent: false, via: "skipped", reason: "CI environment" };
  }

  // macOS: osascript
  if (os === "darwin") {
    const soundClause = sound ? ' sound name "default"' : "";
    const cmd = `osascript -e 'display notification "${escapeOsascript(message)}" with title "${escapeOsascript(title)}"${soundClause}'`;
    if (dryRun) return { sent: true, via: "osascript", reason: `would run: ${cmd}` };
    try {
      execSync(cmd, { stdio: "ignore", timeout: 5000 });
      return { sent: true, via: "osascript" };
    } catch (err) {
      return { sent: false, via: "osascript", reason: (err as Error).message };
    }
  }

  // Windows native or WSL: PowerShell
  if (os === "win32" || isWsl()) {
    const psCmd = `powershell.exe -NoProfile -Command "Add-Type -AssemblyName System.Windows.Forms; $n = New-Object System.Windows.Forms.NotifyIcon; $n.Icon = [System.Drawing.SystemIcons]::Information; $n.Visible = $true; $n.ShowBalloonTip(5000, '${title.replace(/'/g, "''")}', '${message.replace(/'/g, "''")}', 'Info')"`;
    if (dryRun) return { sent: true, via: "powershell", reason: "would run: PowerShell notification" };
    try {
      execSync(psCmd, { stdio: "ignore", timeout: 10000 });
      return { sent: true, via: "powershell" };
    } catch (err) {
      return { sent: false, via: "powershell", reason: (err as Error).message };
    }
  }

  // Linux: notify-send
  if (hasCommand("notify-send")) {
    const cmd = `notify-send --app-name="${appName}" "${title.replace(/"/g, '\\"')}" "${message.replace(/"/g, '\\"')}"`;
    if (dryRun) return { sent: true, via: "notify-send", reason: `would run: ${cmd}` };
    try {
      execSync(cmd, { stdio: "ignore", timeout: 5000 });
      return { sent: true, via: "notify-send" };
    } catch (err) {
      return { sent: false, via: "notify-send", reason: (err as Error).message };
    }
  }

  return {
    sent: false,
    via: "skipped",
    reason: "no notification backend found",
  };
}
