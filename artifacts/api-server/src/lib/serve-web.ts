import express, { type Express } from "express";
import { existsSync } from "node:fs";
import path from "node:path";
import apps from "../../../../scripts/web-apps.json";

/** Replace the Replit static routing proxy only when explicitly requested. */
export function serveWebApps(app: Express, root: string): void {
  for (const web of [...apps].sort((a, b) => b.basePath.length - a.basePath.length)) {
    const dir = path.join(root, "artifacts", web.dir, "dist", "public");
    const index = path.join(dir, "index.html");
    if (!existsSync(index)) throw new Error(`Missing ${web.dir} build. Run pnpm build first.`);
    const prefix = web.basePath === "/" ? "/" : web.basePath.replace(/\/$/, "");
    app.use(prefix, express.static(dir));
    app.use(prefix, (req, res, next) => {
      if (!["GET", "HEAD"].includes(req.method) || path.extname(req.path) || !req.accepts("html")) {
        next();
        return;
      }
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(index);
    });
  }
}
