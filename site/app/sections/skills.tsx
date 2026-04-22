import { CopyCommand } from "../components/copy-command";
import { Section } from "../components/section";

/**
 * Skills — points agents at the two cligentic skills (one for authors,
 * one for consumers). Sits right after the hero so the user sees the
 * agent workflow before scrolling into the catalog.
 */
export function Skills() {
  return (
    <Section
      id="skills"
      kicker="Agent workflow"
      title="Two skills for Claude Code, Cursor, any MCP-aware agent."
      description="cligentic ships two skills. Install the one you need — or both. Each one is a single file with a focused trigger description so the agent picks it up automatically when you describe the work."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Consumer skill */}
        <article className="flex flex-col gap-5 rounded-2xl border border-[color:var(--color-bg-border)] bg-[color:var(--color-bg-elevated)] p-7">
          <header className="flex flex-col gap-2">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-accent)]">
              For app authors
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-[color:var(--color-fg)]">
              Install blocks into the CLI you're building.
            </h3>
            <p className="text-sm text-[color:var(--color-fg-muted)]">
              Use this when the agent is adding killswitches, audit logs, atomic
              writes, JSON mode, or any other primitive to a CLI project. The
              skill routes natural-language intent ("my CLI needs a trust
              ladder") to the right block, runs{" "}
              <code className="font-mono text-[12px] text-[color:var(--color-fg)]">
                bunx shadcn add
              </code>
              , and tells you where to wire it in.
            </p>
          </header>
          <CopyCommand
            command="npx skills add Railly/cligentic --skill cligentic-add"
            variant="hero"
          />
          <ul className="flex flex-col gap-2 text-sm text-[color:var(--color-fg-muted)]">
            <li>
              <span className="text-[color:var(--color-accent)]">→</span> Maps
              intents to blocks ("panic button" →{" "}
              <code className="font-mono text-[12px] text-[color:var(--color-fg)]">
                killswitch
              </code>
              ).
            </li>
            <li>
              <span className="text-[color:var(--color-accent)]">→</span> Fetches
              the live registry at install time, never stale.
            </li>
            <li>
              <span className="text-[color:var(--color-accent)]">→</span> Never
              installs blindly — each block is opinionated.
            </li>
          </ul>
        </article>

        {/* Author skill */}
        <article className="flex flex-col gap-5 rounded-2xl border border-[color:var(--color-bg-border)] bg-[color:var(--color-bg-elevated)] p-7">
          <header className="flex flex-col gap-2">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-accent)]">
              For registry authors
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-[color:var(--color-fg)]">
              Extract a primitive into a new block.
            </h3>
            <p className="text-sm text-[color:var(--color-fg-muted)]">
              Use this when you have a pattern in production (an audit helper, a
              retry loop, a first-run wizard) and want to publish it to the
              registry. The skill walks through the extraction: pick the layer,
              generalize the API, write the MDX doc, register in{" "}
              <code className="font-mono text-[12px] text-[color:var(--color-fg)]">
                registry.json
              </code>
              , rebuild.
            </p>
          </header>
          <CopyCommand
            command="npx skills add Railly/cligentic --skill cligentic-author"
            variant="hero"
          />
          <ul className="flex flex-col gap-2 text-sm text-[color:var(--color-fg-muted)]">
            <li>
              <span className="text-[color:var(--color-accent)]">→</span> Enforces
              the four-layer model (platform / foundation / agent / safety).
            </li>
            <li>
              <span className="text-[color:var(--color-accent)]">→</span> Generates
              the MDX doc in the house style.
            </li>
            <li>
              <span className="text-[color:var(--color-accent)]">→</span> Rebuilds
              the shadcn registry and verifies the new block is live.
            </li>
          </ul>
        </article>
      </div>

      {/* Footnote */}
      <p className="mt-10 max-w-2xl text-sm text-[color:var(--color-fg-muted)]">
        Both skills are single-file markdown, versioned in the{" "}
        <a
          href="https://github.com/Railly/cligentic"
          className="text-[color:var(--color-fg)] underline decoration-[color:var(--color-bg-border)] underline-offset-4 hover:decoration-[color:var(--color-accent)]"
        >
          cligentic repo
        </a>
        . Edit freely after install — Claude Code picks up local edits on the
        next session.
      </p>
    </Section>
  );
}
