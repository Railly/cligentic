import { Section } from "../components/section";
import { type DemoStep, TerminalDemo } from "../components/terminal-demo";

const AGENT_STEPS: DemoStep[] = [
  {
    command: "myapp portfolio --json",
    output: [
      { text: "", type: "empty" },
      { text: "  stdout:", type: "muted" },
      { text: '  {"found":3,"items":[', type: "output" },
      { text: '    {"id":"AAPL","qty":10,"price":189.50},', type: "output" },
      { text: '    {"id":"MSFT","qty":5,"price":421.30},', type: "output" },
      { text: '    {"id":"GOOG","qty":2,"price":176.80}', type: "output" },
      { text: "  ]}", type: "output" },
      { text: "", type: "empty" },
      { text: "  stderr:", type: "muted" },
      { text: '  {"type":"next-step","command":"myapp show AAPL","description":"detail view"}', type: "accent" },
      { text: '  {"type":"next-step","command":"myapp quote MSFT","description":"live price"}', type: "accent" },
    ],
  },
  {
    command: "myapp show AAPL --json",
    output: [
      { text: "", type: "empty" },
      { text: '  {"ticker":"AAPL","name":"Apple Inc.","qty":10,', type: "output" },
      { text: '   "avgCost":142.30,"currentPrice":189.50,', type: "output" },
      { text: '   "gain":"+33.1%","gainUsd":472.00}', type: "output" },
      { text: "", type: "empty" },
      { text: '  {"type":"next-step","command":"myapp order sell AAPL","description":"take profit"}', type: "accent" },
      { text: '  {"type":"next-step","command":"myapp quote AAPL","description":"refresh price"}', type: "accent" },
    ],
  },
];

/**
 * AgentDemo section. Animated terminal showing a real agent-style
 * interaction: run a command, read JSON stdout, follow next-step
 * hints from stderr, run the suggested command.
 */
export function AgentDemo() {
  return (
    <Section
      id="agent-demo"
      kicker="The flagship"
      title="stdout is data. stderr is guidance. Agents read both."
      description="json-mode and next-steps work together to split a command's output into two streams. Agents parse stdout as JSON (the answer) and stderr as NDJSON next-step hints (what to try next). No system prompt needed. The CLI teaches itself."
    >
      <div className="mx-auto max-w-3xl">
        <TerminalDemo
          steps={AGENT_STEPS}
          title="agent loop"
        />
      </div>

      <div className="mx-auto mt-8 max-w-3xl rounded-lg border border-[color:var(--color-bg-border)] bg-[color:var(--color-bg-elevated)] p-5">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-accent)]">
          The loop
        </div>
        <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-[color:var(--color-fg-muted)]">
          <span className="text-[color:var(--color-fg-dim)]">
            {"// agent reads both streams\n"}
          </span>
          <span className="text-[color:var(--color-fg)]">const</span>
          {" data = JSON.parse(stdout);\n"}
          <span className="text-[color:var(--color-fg)]">const</span>
          {" hints = stderr.split("}
          <span className="text-[color:var(--color-accent)]">{'"\\n"'}</span>
          {")\n"}
          {"  .map(JSON.parse)\n"}
          {"  .filter(o => o.type === "}
          <span className="text-[color:var(--color-accent)]">
            {'"next-step"'}
          </span>
          {");\n\n"}
          <span className="text-[color:var(--color-fg-dim)]">
            {"// agent picks the next command from hints\n"}
          </span>
          {"run(hints[0].command);"}
        </pre>
      </div>
    </Section>
  );
}
