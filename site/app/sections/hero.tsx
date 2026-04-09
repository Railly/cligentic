import { CopyCommand } from "../components/copy-command";
import { Header } from "../components/header";
import { getHeroInstallCommand } from "../lib/registry";

/**
 * Hero — the ui.sh-inspired monolith. Oversized Swiss headline,
 * muted subtitle, single install-command CTA.
 *
 * This is the only place where the brand thesis gets loud.
 * Everything else on the landing supports this sentence.
 */
export function Hero() {
  const installCmd = getHeroInstallCommand();

  return (
    <div className="relative min-h-[92vh] overflow-hidden">
      {/* Radial glow anchored to bottom-left where the CTA sits */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid opacity-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/4 rounded-full bg-[color:var(--color-accent-glow)] blur-[120px]"
      />

      <div className="relative z-10 flex min-h-[92vh] flex-col">
        <Header />

        <div className="flex flex-1 flex-col justify-center px-10 pb-14 md:px-16 md:pb-20">
          <h1 className="hero-display max-w-[16ch] text-balance text-[color:var(--color-fg)]">
            Your CLI is the last thing agents touch.
          </h1>

          <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-fg-muted)] md:text-base">
            Copy-paste CLI blocks for the agent era.{" "}
            <span className="text-[color:var(--color-fg)]">
              Trust ladders, killswitches,{" "}
              <code className="font-mono text-[13px]">--json</code> dual mode,
              audit trails.
            </span>{" "}
            Battle-tested in CLIs shipping real money and real taxes.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <CopyCommand command={installCmd} variant="hero" />
            <a
              href="#how-it-works"
              className="btn-ghost font-mono text-[12px]"
            >
              ↓ how it works
            </a>
          </div>

          <p className="mt-6 font-mono text-[11px] text-[color:var(--color-fg-dim)]">
            Installs{" "}
            <span className="text-[color:var(--color-fg-muted)]">next-steps</span>
            {" + auto-pulls "}
            <span className="text-[color:var(--color-fg-muted)]">json-mode</span>
            {" via registryDependencies."}
          </p>
        </div>
      </div>
    </div>
  );
}
