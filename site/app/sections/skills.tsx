import { CopyCommand } from "../components/copy-command";
import { Section } from "../components/section";

/**
 * Skills — two skills, one pill each, minimal copy. The detail lives in
 * the skill files themselves; this section is just the pointer.
 */
export function Skills() {
  return (
    <Section
      id="skills"
      kicker="Agent workflow"
      title="Two skills. One for building, one for publishing."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <article className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-bg-border)] bg-[color:var(--color-bg-elevated)] p-7">
          <div className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-accent)]">
            Using blocks
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-[color:var(--color-fg)]">
            Install blocks into your CLI.
          </h3>
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            Routes intent to the right block and runs{" "}
            <code className="font-mono text-[12px] text-[color:var(--color-fg)]">
              bunx shadcn add
            </code>
            .
          </p>
          <CopyCommand
            command="npx skills add Railly/cligentic --skill cligentic-add"
            variant="hero"
          />
        </article>

        <article className="flex flex-col gap-4 rounded-2xl border border-[color:var(--color-bg-border)] bg-[color:var(--color-bg-elevated)] p-7">
          <div className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-accent)]">
            Authoring blocks
          </div>
          <h3 className="text-xl font-semibold tracking-tight text-[color:var(--color-fg)]">
            Extract a primitive into a new block.
          </h3>
          <p className="text-sm text-[color:var(--color-fg-muted)]">
            Picks the layer, writes the MDX, registers, rebuilds.
          </p>
          <CopyCommand
            command="npx skills add Railly/cligentic --skill cligentic-author"
            variant="hero"
          />
        </article>
      </div>
    </Section>
  );
}
