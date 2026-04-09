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
};
