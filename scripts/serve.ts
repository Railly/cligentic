// serve.ts — minimal static server for public/ during local development.
//
// Serves cligentic's built registry files at http://localhost:4711/r/*.json
// so that local consumers can test with:
//   bunx shadcn@latest add http://localhost:4711/r/open-url.json

import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const PORT = Number(process.env.PORT ?? 4711);
const ROOT = new URL("..", import.meta.url).pathname;
const PUBLIC_DIR = join(ROOT, "public");

const MIME: Record<string, string> = {
  ".json": "application/json",
  ".html": "text/html",
  ".txt": "text/plain",
  ".ts": "text/plain",
  ".js": "application/javascript",
};

Bun.serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname === "/" ? "/r/index.json" : url.pathname;
    const file = join(PUBLIC_DIR, pathname);

    // Prevent path traversal.
    if (!file.startsWith(PUBLIC_DIR)) {
      return new Response("forbidden", { status: 403 });
    }

    if (!existsSync(file) || !statSync(file).isFile()) {
      return new Response(`not found: ${pathname}`, { status: 404 });
    }

    const body = readFileSync(file);
    const mime = MIME[extname(file)] ?? "application/octet-stream";
    return new Response(body, {
      headers: {
        "content-type": mime,
        "access-control-allow-origin": "*",
        "cache-control": "no-store",
      },
    });
  },
});

console.log(`[cligentic] serving ${PUBLIC_DIR} at http://localhost:${PORT}`);
console.log(`[cligentic] index: http://localhost:${PORT}/r/index.json`);
console.log(`[cligentic] test consumer with:`);
console.log(
  `  cd prototype-consumer && bunx shadcn@latest add http://localhost:${PORT}/r/open-url.json`,
);
