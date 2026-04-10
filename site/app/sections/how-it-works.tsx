import { CopyCommand } from "../components/copy-command";
import { Section } from "../components/section";

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      kicker="How it works"
      title="Install. Import. Own."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] text-[color:var(--color-accent)]">01</span>
            <h3 className="text-base font-semibold text-[color:var(--color-fg)]">Run one command</h3>
          </div>
          <p className="text-[13px] leading-relaxed text-[color:var(--color-fg-muted)]">
            shadcn fetches the block, writes files, installs deps.
          </p>
          <CopyCommand
            command="bunx shadcn@latest add cligentic.railly.dev/r/open-url.json"
            variant="inline"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] text-[color:var(--color-accent)]">02</span>
            <h3 className="text-base font-semibold text-[color:var(--color-fg)]">Import the block</h3>
          </div>
          <p className="text-[13px] leading-relaxed text-[color:var(--color-fg-muted)]">
            A local file in your project. No package, no framework.
          </p>
          <pre className="overflow-hidden rounded-lg border border-[color:var(--color-bg-border)] bg-[color:var(--color-bg)] p-4 font-mono text-[12px] leading-relaxed">
            <span className="text-[color:var(--color-fg-dim)]">{"import { openUrl } from "}</span>
            <span className="text-[color:var(--color-accent)]">{'"@/cli/platform/open-url"'}</span>
            {";\n\n"}
            <span className="text-[color:var(--color-fg-dim)]">{"const "}</span>
            {"result = "}
            <span className="text-[color:var(--color-fg)]">{"await "}</span>
            <span className="text-[color:var(--color-accent)]">openUrl</span>
            {"(url);"}
          </pre>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[11px] text-[color:var(--color-accent)]">03</span>
            <h3 className="text-base font-semibold text-[color:var(--color-fg)]">Own it forever</h3>
          </div>
          <p className="text-[13px] leading-relaxed text-[color:var(--color-fg-muted)]">
            Edit it, delete lines, add brand colors. Zero runtime dep on cligentic.
          </p>
          <pre className="overflow-hidden rounded-lg border border-[color:var(--color-bg-border)] bg-[color:var(--color-bg)] p-4 font-mono text-[12px] leading-relaxed">
            <span className="text-[color:var(--color-fg-dim)]">{"$ grep cligentic package.json\n"}</span>
            <span className="text-[color:var(--color-accent)]">{"(nothing)"}</span>
          </pre>
        </div>
      </div>
    </Section>
  );
}
