import { Section } from "../components/section";

export function Why() {
  const pillars = [
    {
      kicker: "01",
      title: "You've built these 30 times.",
      body: "Config loader. Session tokens. JSON output. Audit trail. Banner. Every CLI reinvents the same pieces. Copy them once, own them forever.",
    },
    {
      kicker: "02",
      title: "Agents can't parse your output.",
      body: "stdout must be JSON. stderr must be hints. No framework ships that discipline. cligentic blocks do.",
    },
    {
      kicker: "03",
      title: "Safety is hand-rolled every time.",
      body: "Killswitches. Trust ladders. Intent tokens. Audit trails. None of this exists in clack, oclif, or citty.",
    },
  ];

  return (
    <Section
      id="why"
      kicker="The problem"
      title="CLI primitives stopped evolving. Agents didn't."
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
