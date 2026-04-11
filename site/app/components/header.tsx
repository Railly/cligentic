import Link from "next/link";
import { GitHubStarButton } from "./github-star-button";
import { Logo } from "./logo";

/**
 * Top bar of the landing. Logo top-left, GitHub star button top-right.
 * Sits inside the viewport hairline frame.
 */
export function Header() {
  return (
    <header className="flex items-start justify-between px-10 pt-14 md:px-16">
      <Link href="/" className="shrink-0" aria-label="cligentic home">
        <Logo />
      </Link>

      <div className="hidden sm:block">
        <GitHubStarButton />
      </div>
    </header>
  );
}
