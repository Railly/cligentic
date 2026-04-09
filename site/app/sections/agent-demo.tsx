import { Section } from "../components/section";
import { TerminalPreview } from "../components/terminal-preview";

/**
 * AgentDemo — the flagship section. Shows the actual stdout/stderr split
 * from a real cligentic-powered CLI invocation, with an agent consuming
 * both streams independently.
 *
 * This is the screenshot that should go on the HN thread.
 */
export function AgentDemo() {
  return (
    <Section
      id="agent-demo"
      kicker="The flagship"
      title="stdout is data. stderr is guidance. Agents read both."
      description="json-mode and next-steps work together to split a command's output into two mono-typed streams. Agents parse stdout as JSON (the answer) and stderr as NDJSON next-step hints (what to try next). No system prompt instruction needed. The CLI teaches itself."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <TerminalPreview title="portfolio --json (stdout)" stream="stdout">
          {`{
  "found": 3,
  "items": [
    { "id": "AAPL", "qty": 10 },
    { "id": "MSFT", "qty": 5 },
    { "id": "GOOG", "qty": 2 }
  ]
}`}
        </TerminalPreview>

        <TerminalPreview title="portfolio --json (stderr)" stream="stderr">
          {`{"type":"next-step","command":"myapp show AAPL","description":"detail view"}
{"type":"next-step","command":"myapp quote MSFT","description":"live price"}
{"type":"next-step","command":"myapp export --format csv","description":"export all","optional":true}`}
        </TerminalPreview>
      </div>

      <div className="mt-6 rounded-lg border border-[color:var(--color-bg-border)] bg-[color:var(--color-bg-elevated)] p-5">
        <div className="mb-3 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-accent)]">
          The agent loop
        </div>
        <pre className="overflow-x-auto font-mono text-[12px] leading-relaxed text-[color:var(--color-fg-muted)]">
          <span className="text-[color:var(--color-fg-dim)]">
            {"// agent pseudocode\n"}
          </span>
          <span className="text-[color:var(--color-fg)]">const</span>
          {" { stdout, stderr } = await spawn(cli, args);\n"}
          <span className="text-[color:var(--color-fg)]">const</span>
          {" data = JSON.parse(stdout);                     "}
          <span className="text-[color:var(--color-fg-dim)]">
            // pure data, no contamination
          </span>
          {"\n"}
          <span className="text-[color:var(--color-fg)]">const</span>
          {" hints = stderr.split("}
          <span className="text-[color:var(--color-accent)]">{'"\\n"'}</span>
          {").filter(Boolean)\n  .map(JSON.parse)\n  .filter(o => o.type === "}
          <span className="text-[color:var(--color-accent)]">
            {'"next-step"'}
          </span>
          {");\n\n"}
          <span className="text-[color:var(--color-fg-dim)]">
            {"// agent now has both: what happened + what to try next\n"}
          </span>
          {"nextCommand(data, hints);"}
        </pre>
      </div>
    </Section>
  );
}
