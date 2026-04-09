import Link from "next/link";
import { Logo } from "./logo";

/**
 * Top bar of the landing. Logo top-left, credit top-right.
 * Sits inside the viewport hairline frame.
 */
export function Header() {
  return (
    <header className="flex items-start justify-between px-10 pt-14 md:px-16">
      <Link href="/" className="shrink-0" aria-label="cligentic home">
        <Logo />
      </Link>

      <div className="hidden text-right text-[11px] leading-tight text-[color:var(--color-fg-dim)] sm:block">
        <div>By Railly Hugo</div>
        <div className="text-[color:var(--color-fg-muted)]">
          Battle-tested in{" "}
          <Link
            href="https://github.com/crafter-station/hapi-cli"
            className="underline decoration-[color:var(--color-fg-dim)] underline-offset-2 hover:text-[color:var(--color-accent)] hover:decoration-[color:var(--color-accent)]"
          >
            hapi-cli
          </Link>
          {" + "}
          <Link
            href="https://github.com/crafter-station/sunat-cli"
            className="underline decoration-[color:var(--color-fg-dim)] underline-offset-2 hover:text-[color:var(--color-accent)] hover:decoration-[color:var(--color-accent)]"
          >
            sunat-cli
          </Link>
        </div>
      </div>
    </header>
  );
}
