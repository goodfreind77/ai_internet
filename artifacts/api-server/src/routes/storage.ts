import { Router, type IRouter, type Request, type Response } from "express";
import { ObjectStorageService } from "../lib/objectStorage";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();
const IMAGE_CACHE_LIMIT = 24 * 1024 * 1024;
const IMAGE_CACHE_TTL = 60 * 60 * 1000;
const imageCache = new Map<string, { bytes: Buffer; contentType: string; storedAt: number }>();
let cachedBytes = 0;

function sendPublicBytes(res: Response, bytes: Buffer, contentType: string) {
  if (res.destroyed || res.writableEnded) return;
  const inlineImage = /^image\/(?:webp|png|jpeg|gif|avif)$/.test(contentType);
  res.setHeader("Content-Type", inlineImage ? contentType : "application/octet-stream");
  if (!inlineImage) res.setHeader("Content-Disposition", "attachment");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.send(bytes);
}

router.get(
  "/storage/public-objects/*filePath",
  async (req: Request, res: Response) => {
    try {
      const rawPath = req.params.filePath;
      const filePath = Array.isArray(rawPath) ? rawPath.join("/") : rawPath;
      if (
        !filePath ||
        filePath.includes("\\") ||
        filePath.includes("\0") ||
        filePath.split("/").some((part) => !part || part === "." || part === "..")
      ) {
        res.status(404).json({ error: "Public object not found" });
        return;
      }

      const version = typeof req.query.v === "string" && /^[a-f0-9]{12}$/.test(req.query.v)
        ? req.query.v : null;
      const cacheKey = version ? `${filePath}?v=${version}` : null;
      const cached = cacheKey ? imageCache.get(cacheKey) : undefined;
      if (cached && Date.now() - cached.storedAt < IMAGE_CACHE_TTL) {
        imageCache.delete(cacheKey!);
        imageCache.set(cacheKey!, cached);
        sendPublicBytes(res, cached.bytes, cached.contentType);
        return;
      }
      if (cached) {
        cachedBytes -= cached.bytes.length;
        imageCache.delete(cacheKey!);
      }

      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        res.status(404).json({ error: "Public object not found" });
        return;
      }

      const [metadata] = await file.getMetadata();
      const size = Number(metadata.size);
      // Buffer bounded image downloads independently of browser cancellation.
      // Destroying an in-flight GCS stream on response close can throw inside
      // the SDK's asynchronous pipeline, outside the route's error handler.
      if (!Number.isFinite(size) || size > 25 * 1024 * 1024) {
        res.status(413).json({ error: "Public object exceeds the download size limit" });
        return;
      }
      const [bytes] = await file.download();
      const contentType = metadata.contentType || "application/octet-stream";
      if (cacheKey && /^image\//.test(contentType) && bytes.length <= 1024 * 1024) {
        const previous = imageCache.get(cacheKey);
        if (previous) cachedBytes -= previous.bytes.length;
        imageCache.delete(cacheKey);
        imageCache.set(cacheKey, { bytes, contentType, storedAt: Date.now() });
        cachedBytes += bytes.length;
        while (cachedBytes > IMAGE_CACHE_LIMIT) {
          const oldest = imageCache.entries().next().value;
          if (!oldest) break;
          cachedBytes -= oldest[1].bytes.length;
          imageCache.delete(oldest[0]);
        }
      }
      sendPublicBytes(res, bytes, contentType);
    } catch (error) {
      req.log.error({ err: error }, "Error serving public object");
      if (!res.destroyed && !res.headersSent) {
        res.status(500).json({ error: "Failed to serve public object" });
      }
    }
  },
);

export default router;