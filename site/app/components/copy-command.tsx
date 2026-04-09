"use client";

import { useState } from "react";

type Props = {
  command: string;
  className?: string;
  variant?: "hero" | "inline";
};

export function CopyCommand({ command, className = "", variant = "hero" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore — some browsers block in insecure contexts
    }
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`group inline-flex items-center gap-2 rounded-md border border-[color:var(--color-bg-border)] bg-[color:var(--color-bg-elevated)] px-3 py-2 text-left font-mono text-xs text-[color:var(--color-fg-muted)] transition-colors hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-fg)] ${className}`}
      >
        <span className="text-[color:var(--color-accent)]">$</span>
        <span className="flex-1 truncate">{command}</span>
        <span
          className="shrink-0 text-[color:var(--color-fg-dim)] group-hover:text-[color:var(--color-accent)]"
          aria-hidden
        >
          {copied ? "✓" : "⧉"}
        </span>
        <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`btn-accent group ${className}`}
      aria-label={copied ? "Copied to clipboard" : "Copy install command"}
    >
      <span className="btn-label flex items-center gap-2">
        <span className="text-[color:var(--color-bg)] opacity-60">$</span>
        <span className="truncate">{command}</span>
      </span>
      <span className="btn-arrow" aria-hidden>
        {copied ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 8L6.5 11.5L13 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="3.5"
              y="3.5"
              width="9"
              height="9"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
