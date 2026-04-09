import { Section } from "../components/section";

/**
 * Why — the thesis section. Three columns of "the problem nobody's solving."
 * No blocks, no screenshots, just words. This is where the reader decides
 * if they buy the premise.
 */
export function Why() {
  const pillars = [
    {
      kicker: "01",
      title: "Every CLI ships the same 30 problems.",
      body: "State directory. Config loader. Session persistence. JSON output. Error mapping. Audit trail. Spinner. Banner. Help override. You've written them a dozen times. cligentic extracts the winners and lets you copy them. You own every byte.",
    },
    {
      kicker: "02",
      title: "Agents need CLIs to be machine-operable.",
      body: "stdout must be data. stderr must be hints. `--json` must exist. Next steps must be structured. No CLI framework treats agents as a first-class consumer. cligentic's blocks ship with that discipline from line one.",
    },
    {
      kicker: "03",
      title: "High-stakes CLIs need safety primitives.",
      body: "Trust ladders with tiered auth. Killswitch files. Append-only audit logs. Intent tokens bound to operation fingerprints. These aren't in clack, oclif, citty, or any npm lib. They're hand-rolled every time. Not anymore.",
    },
  ];

  return (
    <Section
      id="why"
      kicker="The problem"
      title="CLI tooling stopped evolving when humans stopped being the primary operators."
      description="The stack (commander, oclif, inquirer) was designed for a world before Claude Code, Cursor, and Codex. Agents operate CLIs now. The primitives haven't caught up."
    >
      <div className="grid gap-8 md:grid-cols-3 md:gap-10">
        {pillars.map((pillar) => (
          <div key={pillar.kicker} className="border-t border-[color:var(--color-accent)] pt-5">
            <div className="mb-3 font-mono text-[11px] text-[color:var(--color-accent)]">
              {pillar.kicker}
            </div>
            <h3 className="mb-3 text-lg font-semibold leading-snug tracking-tight text-[color:var(--color-fg)]">
              {pillar.title}
            </h3>
            <p className="text-[13px] leading-relaxed text-[color:var(--color-fg-muted)]">
              {pillar.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
