"use client";

import { useEffect, useRef, useState } from "react";

type OutputLine = {
  text: string;
  type: "output" | "accent" | "muted" | "empty";
};

export type DemoStep = {
  command: string;
  output: OutputLine[];
};

type TerminalLine =
  | { kind: "prompt"; command: string; cursor: boolean }
  | { kind: "output"; line: OutputLine }
  | { kind: "separator" };

const CHAR_DELAY = 35;
const LINE_DELAY = 80;
const STEP_PAUSE = 900;

type Props = {
  steps: DemoStep[];
  title?: string;
  className?: string;
};

export function TerminalDemo({ steps, title = "terminal", className = "" }: Props) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setVisible(true);
      },
      { threshold: 0.3 },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (!visible) return;

    let cancelled = false;

    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        animRef.current = setTimeout(resolve, ms);
      });

    const run = async () => {
      setLines([]);

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i] as DemoStep;
        if (cancelled) break;

        if (i > 0) {
          setLines((prev) => [...prev, { kind: "separator" }]);
          await delay(200);
        }

        let typed = "";
        setLines((prev) => [
          ...prev,
          { kind: "prompt", command: "", cursor: true },
        ]);

        for (const char of step.command) {
          if (cancelled) break;
          await delay(CHAR_DELAY);
          typed += char;
          const cmd = typed;
          setLines((prev) => {
            const next = [...prev];
            next[next.length - 1] = { kind: "prompt", command: cmd, cursor: true };
            return next;
          });
        }

        if (cancelled) break;

        setLines((prev) => {
          const next = [...prev];
          next[next.length - 1] = { kind: "prompt", command: step.command, cursor: false };
          return next;
        });

        await delay(LINE_DELAY);

        for (const outputLine of step.output) {
          if (cancelled) break;
          await delay(LINE_DELAY);
          setLines((prev) => [...prev, { kind: "output", line: outputLine }]);
        }

        if (cancelled) break;
        await delay(STEP_PAUSE);
      }
    };

    run();

    return () => {
      cancelled = true;
      if (animRef.current) clearTimeout(animRef.current);
    };
  }, [visible, steps]);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      <div className="overflow-hidden rounded-lg border border-[color:var(--color-bg-border)]">
        <div className="flex items-center gap-2 border-b border-[color:var(--color-bg-border)] bg-[color:var(--color-bg-elevated)] px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-bg-border)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-bg-border)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-bg-border)]" />
          </div>
          <span className="ml-2 flex-1 text-center font-mono text-[11px] text-[color:var(--color-fg-dim)]">
            {title}
          </span>
        </div>

        <div
          ref={scrollRef}
          className="max-h-[320px] overflow-y-auto bg-[color:var(--color-bg)] p-5 font-mono text-[13px]"
        >
          {lines.map((line, i) => {
            const key = `${i}-${line.kind}`;

            if (line.kind === "separator") {
              return (
                <div
                  key={key}
                  className="my-3 border-t border-[color:var(--color-bg-border)]"
                />
              );
            }

            if (line.kind === "prompt") {
              return (
                <div key={key} className="flex items-start gap-2 leading-relaxed">
                  <span className="select-none text-[color:var(--color-accent)]">
                    $
                  </span>
                  <span className="text-[color:var(--color-fg)]">
                    {line.command}
                    {line.cursor && <span className="cli-cursor">&nbsp;</span>}
                  </span>
                </div>
              );
            }

            const { line: ol } = line;

            if (ol.type === "empty") {
              return <div key={key} className="h-3" />;
            }

            if (ol.type === "accent") {
              return (
                <div
                  key={key}
                  className="leading-relaxed text-[color:var(--color-accent)]"
                >
                  {ol.text}
                </div>
              );
            }

            if (ol.type === "muted") {
              return (
                <div
                  key={key}
                  className="leading-relaxed text-[color:var(--color-fg-dim)]"
                >
                  {ol.text}
                </div>
              );
            }

            return (
              <div
                key={key}
                className="leading-relaxed text-[color:var(--color-fg-muted)]"
              >
                {ol.text}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .cli-cursor {
          display: inline-block;
          width: 8px;
          height: 15px;
          background: var(--color-accent);
          vertical-align: text-bottom;
          animation: cursor-blink 1.2s step-end infinite;
        }
        @keyframes cursor-blink {
          0%, 70% { opacity: 1; }
          71%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
