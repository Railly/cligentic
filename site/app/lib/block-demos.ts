import type { DemoStep } from "../components/terminal-demo";

export const blockDemos: Record<string, { title: string; steps: DemoStep[] }> = {
  "open-url": {
    title: "open-url demo",
    steps: [
      {
        command: "myapp login",
        output: [
          { text: "  Opening browser for authentication...", type: "output" },
          { text: "  Opened: https://auth.example.com/login?redirect=...", type: "accent" },
          { text: "  Waiting for callback...", type: "muted" },
          { text: "  Authenticated as hunter@railly.dev", type: "accent" },
        ],
      },
      {
        command: "myapp login  (over SSH, no browser)",
        output: [
          { text: "  No browser available (headless).", type: "muted" },
          { text: "", type: "empty" },
          { text: "  Open this URL in your browser to sign in:", type: "output" },
          { text: "  https://auth.example.com/login?redirect=...", type: "accent" },
          { text: "", type: "empty" },
          { text: "  Waiting for callback...", type: "muted" },
          { text: "  Authenticated as hunter@railly.dev", type: "accent" },
        ],
      },
    ],
  },
  "json-mode": {
    title: "json-mode demo",
    steps: [
      {
        command: "myapp list",
        output: [
          { text: "  Fetching items...", type: "muted" },
          { text: "  - Apple (AAPL)", type: "output" },
          { text: "  - Microsoft (MSFT)", type: "output" },
          { text: "  - Google (GOOG)", type: "output" },
        ],
      },
      {
        command: "myapp list --json",
        output: [
          { text: '  {"id":"AAPL","name":"Apple","qty":10}', type: "output" },
          { text: '  {"id":"MSFT","name":"Microsoft","qty":5}', type: "output" },
          { text: '  {"id":"GOOG","name":"Google","qty":2}', type: "output" },
        ],
      },
      {
        command: "myapp list | jq '.name'",
        output: [
          { text: '  "Apple"', type: "accent" },
          { text: '  "Microsoft"', type: "accent" },
          { text: '  "Google"', type: "accent" },
        ],
      },
    ],
  },
  "next-steps": {
    title: "next-steps demo",
    steps: [
      {
        command: "myapp deploy --json",
        output: [
          { text: '  {"version":"1.2.0","status":"deployed","url":"https://myapp.com"}', type: "output" },
          { text: "", type: "empty" },
          { text: '  {"type":"next-step","command":"myapp status","description":"check health"}', type: "accent" },
          { text: '  {"type":"next-step","command":"myapp logs -f","description":"tail logs"}', type: "accent" },
          { text: '  {"type":"next-step","command":"myapp rollback","description":"revert","optional":true}', type: "muted" },
        ],
      },
      {
        command: "myapp status",
        output: [
          { text: "  v1.2.0 running on 3/3 instances", type: "output" },
          { text: "  Uptime: 2m 34s", type: "output" },
          { text: "  Health: all green", type: "accent" },
        ],
      },
    ],
  },
  "copy-clipboard": {
    title: "copy-clipboard demo",
    steps: [
      {
        command: "myapp token --copy",
        output: [
          { text: "  Token: sk_live_abc123...xyz", type: "output" },
          { text: "  Copied to clipboard.", type: "accent" },
        ],
      },
      {
        command: "myapp token --copy  (over SSH)",
        output: [
          { text: "  Token: sk_live_abc123...xyz", type: "output" },
          { text: "  Could not copy (no clipboard backend).", type: "muted" },
          { text: "  Copy manually: sk_live_abc123def456xyz", type: "output" },
        ],
      },
    ],
  },
  "notify-os": {
    title: "notify-os demo",
    steps: [
      {
        command: "myapp build --notify",
        output: [
          { text: "  Compiling...", type: "muted" },
          { text: "  Bundling assets...", type: "muted" },
          { text: "  Build complete. 12.4s", type: "output" },
          { text: "", type: "empty" },
          { text: "  [macOS notification sent]", type: "accent" },
          { text: '  "Build complete: myapp v1.2.0 is ready."', type: "accent" },
        ],
      },
    ],
  },
  banner: {
    title: "myapp --help",
    steps: [
      {
        command: "myapp --help",
        output: [
          { text: "", type: "empty" },
          { text: "    █   █ █   █  █████ ████  ████", type: "accent" },
          { text: "    ██ ██  █ █   █   █ █   █ █   █", type: "accent" },
          { text: "    █ █ █   █    █████ ████  ████", type: "accent" },
          { text: "    █   █   █    █   █ █     █", type: "accent" },
          { text: "    █   █   █    █   █ █     █", type: "accent" },
          { text: "", type: "empty" },
          { text: "    v1.0.0  ·  Ship faster.", type: "muted" },
          { text: "", type: "empty" },
          { text: "  Commands:", type: "output" },
          { text: "    deploy       push to production", type: "output" },
          { text: "    status       check deploy status", type: "output" },
          { text: "    rollback     revert last deploy", type: "output" },
        ],
      },
    ],
  },
  killswitch: {
    title: "killswitch demo",
    steps: [
      {
        command: "myapp order buy AAPL --qty 10",
        output: [
          { text: "  Placing order for 10x AAPL...", type: "output" },
          { text: "  Order placed. ID: ord_abc123", type: "accent" },
        ],
      },
      {
        command: "myapp killswitch on --reason 'suspicious activity'",
        output: [
          { text: "  Killswitch activated.", type: "accent" },
          { text: "  All write operations are now blocked.", type: "output" },
        ],
      },
      {
        command: "myapp order buy MSFT --qty 5",
        output: [
          { text: "  Error: Killswitch is ON since 2026-04-09T12:00:00Z", type: "accent" },
          { text: "  Reason: suspicious activity", type: "output" },
          { text: "  All write operations are blocked.", type: "muted" },
          { text: "  Remove ~/.myapp/KILLSWITCH to resume.", type: "muted" },
        ],
      },
    ],
  },
  "audit-log": {
    title: "audit-log demo",
    steps: [
      {
        command: "myapp order buy AAPL --qty 10",
        output: [
          { text: "  Order placed. ID: ord_abc123", type: "accent" },
        ],
      },
      {
        command: "myapp audit tail",
        output: [
          { text: "", type: "empty" },
          { text: "  RECENT AUDIT LOG", type: "muted" },
          { text: "", type: "empty" },
          { text: "  2026-04-09 12:01  order.placed    ok      AAPL x10", type: "output" },
          { text: "  2026-04-09 11:58  auth.login      ok      hunter@railly.dev", type: "output" },
          { text: "  2026-04-09 11:45  config.updated  ok      profile=production", type: "output" },
          { text: "  2026-04-09 11:30  order.placed    blocked killswitch ON", type: "accent" },
          { text: "", type: "empty" },
          { text: "  4 records across 1 file", type: "muted" },
        ],
      },
    ],
  },
  config: {
    title: "config demo",
    steps: [
      {
        command: "myapp config show",
        output: [
          { text: "", type: "empty" },
          { text: "  Active profile: default", type: "muted" },
          { text: '  apiUrl:   "https://api.example.com"', type: "output" },
          { text: "  timeout:  5000", type: "output" },
          { text: "", type: "empty" },
        ],
      },
      {
        command: "myapp config show --profile production",
        output: [
          { text: "", type: "empty" },
          { text: "  Active profile: production", type: "accent" },
          { text: '  apiUrl:   "https://api.prod.example.com"', type: "output" },
          { text: "  timeout:  10000", type: "output" },
          { text: "", type: "empty" },
        ],
      },
    ],
  },
  session: {
    title: "session demo",
    steps: [
      {
        command: "myapp whoami",
        output: [
          { text: "  Not logged in.", type: "muted" },
        ],
      },
      {
        command: "myapp login",
        output: [
          { text: "  Opening browser...", type: "muted" },
          { text: "  Authenticated as hunter@railly.dev", type: "accent" },
          { text: "  Session saved to ~/.config/myapp/sessions/", type: "output" },
        ],
      },
      {
        command: "myapp whoami",
        output: [
          { text: "  hunter@railly.dev", type: "accent" },
          { text: "  Expires: 2026-04-10T12:00:00Z", type: "muted" },
        ],
      },
    ],
  },
  "error-map": {
    title: "error-map demo",
    steps: [
      {
        command: "myapp order buy INVALID_TICKER",
        output: [
          { text: "", type: "empty" },
          { text: "  Error: TickerNotFound", type: "accent" },
          { text: '  "INVALID_TICKER" is not a valid ticker symbol.', type: "output" },
          { text: "", type: "empty" },
          { text: "  Hint: Run myapp search <query> to find valid tickers.", type: "accent" },
          { text: "", type: "empty" },
        ],
      },
      {
        command: "myapp order buy AAPL --qty 999999",
        output: [
          { text: "", type: "empty" },
          { text: "  Error: SpendCapExceeded", type: "accent" },
          { text: "  Order notional $18.9M exceeds cap of $5,000.", type: "output" },
          { text: "", type: "empty" },
          { text: "  Hint: Increase spend_cap_usd in config or use --profile paper.", type: "accent" },
          { text: "", type: "empty" },
        ],
      },
    ],
  },
  "global-flags": {
    title: "global-flags demo",
    steps: [
      {
        command: "myapp list --json --quiet --profile production",
        output: [
          { text: '  {"id":"AAPL","qty":10}', type: "output" },
          { text: '  {"id":"MSFT","qty":5}', type: "output" },
        ],
      },
      {
        command: "myapp deploy --dry-run --verbose",
        output: [
          { text: "  [verbose] Loading config: production", type: "muted" },
          { text: "  [verbose] Resolving dependencies...", type: "muted" },
          { text: "  [verbose] Building assets...", type: "muted" },
          { text: "", type: "empty" },
          { text: "  DRY RUN: would deploy v1.2.0 to prod.example.com", type: "accent" },
          { text: "  No changes made.", type: "output" },
        ],
      },
    ],
  },
  detect: {
    title: "myapp doctor",
    steps: [
      {
        command: "myapp doctor",
        output: [
          { text: "", type: "empty" },
          { text: "  ENVIRONMENT", type: "muted" },
          { text: "  Platform:   darwin (macOS)", type: "output" },
          { text: "  WSL:        no", type: "output" },
          { text: "  CI:         no", type: "output" },
          { text: "  TTY:        yes", type: "accent" },
          { text: "  Headless:   no", type: "output" },
          { text: "", type: "empty" },
          { text: "  BINARIES", type: "muted" },
          { text: "  git:        /usr/bin/git", type: "accent" },
          { text: "  docker:     /usr/local/bin/docker", type: "accent" },
          { text: "  bun:        /usr/local/bin/bun", type: "accent" },
          { text: "", type: "empty" },
          { text: "  All checks passed.", type: "accent" },
        ],
      },
    ],
  },
  "xdg-paths": {
    title: "xdg-paths demo",
    steps: [
      {
        command: "myapp paths",
        output: [
          { text: "", type: "empty" },
          { text: "  APP PATHS (myapp)", type: "muted" },
          { text: "", type: "empty" },
          { text: "  config:    ~/.config/myapp", type: "output" },
          { text: "  state:     ~/.local/state/myapp", type: "output" },
          { text: "  cache:     ~/.cache/myapp", type: "output" },
          { text: "  audit:     ~/.local/state/myapp/audit", type: "output" },
          { text: "  sessions:  ~/.config/myapp/sessions  (0700)", type: "accent" },
          { text: "  tmp:       ~/.cache/myapp/tmp", type: "output" },
        ],
      },
    ],
  },
  telemetry: {
    title: "telemetry demo",
    steps: [
      {
        command: "myapp telemetry status",
        output: [
          { text: "  Telemetry: enabled", type: "accent" },
          { text: "  Events today: 12", type: "output" },
          { text: "  Storage: ~/.cache/myapp/telemetry/", type: "muted" },
        ],
      },
      {
        command: "CLI_NO_TELEMETRY=1 myapp telemetry status",
        output: [
          { text: "  Telemetry: disabled", type: "muted" },
          { text: "  Set CLI_NO_TELEMETRY=1 or DO_NOT_TRACK=1", type: "muted" },
        ],
      },
    ],
  },
};
