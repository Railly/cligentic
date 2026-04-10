import { CopyCommand } from "../components/copy-command";
import { type DemoStep, TerminalDemo } from "../components/terminal-demo";
import { Header } from "../components/header";
import { getHeroInstallCommand } from "../lib/registry";

const HERO_STEPS: DemoStep[] = [
  {
    command: "bunx shadcn add cligentic.railly.dev/r/json-mode.json",
    output: [
      { text: "  Installed dep: picocolors", type: "output" },
      { text: "  Created 2 files:", type: "output" },
      { text: "    cli/platform/detect.ts", type: "accent" },
      { text: "    cli/agent/json-mode.ts", type: "accent" },
    ],
  },
  {
    command: "myapp list --json",
    output: [
      { text: '  {"id":"AAPL","qty":10}', type: "output" },
      { text: '  {"id":"MSFT","qty":5}', type: "output" },
      { text: '  {"type":"next-step","command":"show AAPL"}', type: "accent" },
    ],
  },
];

export function Hero() {
  const installCmd = getHeroInstallCommand();

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/4 rounded-full bg-[color:var(--color-accent-glow)] blur-[120px]"
      />

      <div className="relative z-10 flex min-h-svh flex-col">
        <Header />

        <div className="flex flex-1 items-center px-10 py-10 md:px-16 md:py-14">
          <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Left: headline + CTA */}
            <div>
              <h1 className="hero-display max-w-[16ch] text-balance text-[color:var(--color-fg)]">
                Your CLI is the last thing agents touch.
              </h1>

              <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-[color:var(--color-fg-muted)] md:text-[15px]">
                Copy-paste CLI blocks for the agent era.{" "}
                <span className="text-[color:var(--color-fg)]">
                  Trust ladders, killswitches,{" "}
                  <code className="font-mono text-[13px]">--json</code> dual
                  mode, audit trails.
                </span>{" "}
                Battle-tested in CLIs shipping real money and real taxes.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <CopyCommand command={installCmd} variant="hero" />
                <a
                  href="#how-it-works"
                  className="btn-ghost font-mono text-[12px]"
                >
                  ↓ how it works
                </a>
              </div>

              <p className="mt-4 font-mono text-[11px] text-[color:var(--color-fg-dim)]">
                Installs{" "}
                <span className="text-[color:var(--color-fg-muted)]">
                  next-steps
                </span>
                {" + auto-pulls "}
                <span className="text-[color:var(--color-fg-muted)]">
                  json-mode
                </span>
                {" via registryDependencies."}
              </p>
            </div>

            {/* Right: animated terminal demo */}
            <div className="hidden lg:block">
              <TerminalDemo
                steps={HERO_STEPS}
                title="cligentic"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
