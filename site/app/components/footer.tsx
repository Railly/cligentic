import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-bg-border)] px-10 py-14 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-[13px] leading-relaxed text-[color:var(--color-fg-muted)]">
            Copy-paste CLI blocks for the agent era. Own your primitives. Built
            with strong primitives: citty, clack, picocolors as real deps.
          </p>
          <p className="mt-4 text-[11px] text-[color:var(--color-fg-dim)]">
            MIT · By{" "}
            <Link
              href="https://railly.dev"
              className="underline decoration-[color:var(--color-fg-dim)] underline-offset-2 hover:text-[color:var(--color-accent)]"
            >
              Railly Hugo
            </Link>
          </p>
        </div>

        <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-[13px]">
          <div className="col-span-2 mb-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-fg-dim)]">
            Links
          </div>
          <Link
            href="https://github.com/Railly/cligentic"
            className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-accent)]"
          >
            GitHub
          </Link>
          <Link
            href="/blocks"
            className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-accent)]"
          >
            All blocks
          </Link>
          <Link
            href="https://railly.dev"
            className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-accent)]"
          >
            railly.dev
          </Link>
          <Link
            href="https://x.com/raillyhugo"
            className="text-[color:var(--color-fg-muted)] hover:text-[color:var(--color-accent)]"
          >
            @raillyhugo
          </Link>
        </nav>
      </div>
    </footer>
  );
}
