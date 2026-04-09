import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * MDX configuration — Turbopack-compatible.
 *
 * Rehype/remark plugins must be specified by string name for Turbopack
 * (Rust-side loader) because JavaScript functions and objects can't cross
 * the Rust/JS boundary. This works with rehype-pretty-code which accepts
 * a theme object loaded from a JSON file.
 *
 * See: https://nextjs.org/docs/app/guides/mdx#using-plugins-with-turbopack
 */

// Load the custom Shiki theme from a JSON file. The theme object is
// serializable (no functions, pure data), so Turbopack can pass it
// across the loader boundary.
const cligenticNoir = JSON.parse(
  readFileSync(join(process.cwd(), "public/shiki/cligentic-noir.json"), "utf8"),
);

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          theme: cligenticNoir,
          defaultLang: "typescript",
          keepBackground: false,
        },
      ],
    ],
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  async headers() {
    return [
      {
        source: "/r/:path*",
        headers: [
          { key: "access-control-allow-origin", value: "*" },
          { key: "cache-control", value: "public, max-age=300, s-maxage=300" },
        ],
      },
    ];
  },
};

export default withMDX(nextConfig);
