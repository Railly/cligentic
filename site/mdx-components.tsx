import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ReactNode } from "react";
import { TerminalDemo } from "./app/components/terminal-demo";

/**
 * MDX components — required file at the project root for Next 16's native
 * MDX integration. Maps markdown elements to custom React components that
 * match the cligentic landing aesthetic.
 *
 * This file is auto-detected by @next/mdx. Every .mdx file in the app
 * directory uses these overrides by default.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings — hierarchy via size + weight, all in white with tight tracking
    h1: ({ children }) => (
      <h1 className="mb-4 mt-12 text-3xl font-bold leading-tight tracking-tight text-[color:var(--color-fg)] md:text-4xl md:tracking-[-0.02em]">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 text-2xl font-semibold leading-tight tracking-tight text-[color:var(--color-fg)]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 text-lg font-semibold tracking-tight text-[color:var(--color-fg)]">
        {children}
      </h3>
    ),

    // Body copy — muted grey, comfortable line height
    p: ({ children }) => (
      <p className="my-5 text-[15px] leading-relaxed text-[color:var(--color-fg-muted)]">
        {children}
      </p>
    ),

    // Links — orange accent with subtle underline
    a: ({ href, children }) => {
      const isExternal = href?.startsWith("http");
      return (
        <Link
          href={href ?? "#"}
          className="text-[color:var(--color-accent)] underline decoration-[color:var(--color-accent)]/30 underline-offset-[3px] transition-colors hover:decoration-[color:var(--color-accent)]"
          {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {children}
        </Link>
      );
    },

    // Strong — white emphasized
    strong: ({ children }) => (
      <strong className="font-semibold text-[color:var(--color-fg)]">
        {children}
      </strong>
    ),

    // Emphasis — muted italic
    em: ({ children }) => (
      <em className="italic text-[color:var(--color-fg-muted)]">{children}</em>
    ),

    // Inline code — orange chip on dark.
    // rehype-pretty-code's block <code> has data-language and data-theme attrs.
    // We detect those (or className with "language-") to pass through.
    // Only plain inline code (no data-language, no language- class) gets styled.
    code: (props) => {
      const { children, className, ...rest } = props as Record<string, unknown> & {
        children: React.ReactNode;
        className?: string;
      };
      const isBlock =
        className?.toString().includes("language-") ||
        "data-language" in props ||
        "data-theme" in props;

      if (isBlock) return <code {...(props as React.ComponentProps<"code">)} />;

      return (
        <code className="rounded border border-[color:var(--color-bg-border)] bg-[color:var(--color-bg-elevated)] px-[0.4em] py-[0.15em] font-mono text-[0.875em] text-[color:var(--color-accent)]">
          {children}
        </code>
      );
    },

    // Code blocks — rehype-pretty-code handles all styling via data attrs.
    // Pass through completely. All visual styling lives in globals.css
    // targeting figure[data-rehype-pretty-code-figure] and children.
    pre: (props) => <pre {...props} />,

    // Lists — arrow bullets for everything (ol + ul), no numeric markers.
    // Standard across the site: the flechitas are the list marker.
    ul: ({ children }) => (
      <ul className="my-5 list-none space-y-2 text-[15px] leading-relaxed text-[color:var(--color-fg-muted)]">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-5 list-none space-y-2 text-[15px] leading-relaxed text-[color:var(--color-fg-muted)]">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="relative pl-6 before:absolute before:left-0 before:text-[color:var(--color-accent)] before:content-['→']">
        {children}
      </li>
    ),

    // Blockquote — left border accent
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-[color:var(--color-accent)] pl-5 italic text-[color:var(--color-fg-muted)]">
        {children}
      </blockquote>
    ),

    // Horizontal rule — dim divider
    hr: () => <hr className="my-10 border-t border-[color:var(--color-bg-border)]" />,

    // Table — minimal with border rows
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-[14px]">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b border-[color:var(--color-bg-border)]">
        {children}
      </thead>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest text-[color:var(--color-fg-dim)]">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-t border-[color:var(--color-bg-border)] px-4 py-3 text-[color:var(--color-fg-muted)]">
        {children}
      </td>
    ),

    // Custom components available in all MDX files
    TerminalDemo,

    ...components,
  };
}
