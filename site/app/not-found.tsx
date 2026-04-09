import Link from "next/link";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

export default function NotFound() {
  return (
    <main>
      <Header />
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center px-10 md:px-16">
        <div className="mb-4 font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-accent)]">
          404
        </div>
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-[color:var(--color-fg)] md:text-6xl">
          Block not found.
        </h1>
        <p className="mb-10 max-w-xl text-base leading-relaxed text-[color:var(--color-fg-muted)]">
          The path you requested doesn't match any block in the cligentic
          registry. It may have been renamed, moved to v0.1, or you may have
          hit a typo.
        </p>
        <Link
          href="/#blocks"
          className="btn-ghost font-mono text-[12px] text-[color:var(--color-accent)] hover:text-[color:var(--color-fg)]"
        >
          ← back to the catalog
        </Link>
      </div>
      <Footer />
    </main>
  );
}
