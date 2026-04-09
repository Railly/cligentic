import type { ReactNode } from "react";

type Props = {
  id?: string;
  kicker?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Section — the canonical layout shell for below-the-fold content.
 * Kicker (orange mono label) → title (large white) → description (muted)
 * → children.
 *
 * Use this for consistent vertical rhythm across the landing.
 */
export function Section({ id, kicker, title, description, children, className = "" }: Props) {
  return (
    <section
      id={id}
      className={`border-t border-[color:var(--color-bg-border)] px-10 py-20 md:px-16 md:py-28 ${className}`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          {kicker && (
            <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-accent)]">
              {kicker}
            </div>
          )}
          <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-[color:var(--color-fg)] md:text-5xl md:leading-[1.05] md:tracking-[-0.02em]">
            {title}
          </h2>
          {description && (
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[color:var(--color-fg-muted)]">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
