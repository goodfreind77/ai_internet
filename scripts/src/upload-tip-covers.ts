import { access, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
  EXPECTED_TIP_COVER_COUNT,
  getExpectedTipCoverSlugs,
  getPublicObjectFile,
  readTipCoverManifest,
  sha256,
  tipCoverSourceDirectory,
  verifyManifestObject,
  writeTipCoverManifest,
  type TipCoverManifestEntry,
} from "./tip-cover-assets";

async function main(): Promise<void> {
  const slugs = await getExpectedTipCoverSlugs();
  const expectedSlugs = new Set(slugs);
  const assetsBySlug = new Map<string, TipCoverManifestEntry>();
  let missing = 0;
  let invalid = 0;
  let uploaded = 0;
  let skippedExisting = 0;

  try {
    const previousManifest = await readTipCoverManifest();
    for (const entry of previousManifest.assets) {
      if (!expectedSlugs.has(entry.slug)) {
        throw new Error(`Upload manifest contains unexpected slug ${entry.slug}.`);
      }
      if (await verifyManifestObject(entry)) {
        assetsBySlug.set(entry.slug, entry);
      } else {
        process.stderr.write(
          `Previous upload no longer verifies remotely: ${entry.slug}\n`,
        );
      }
    }
  } catch (error) {
    if (
      !error ||
      typeof error !== "object" ||
      !("code" in error) ||
      error.code !== "ENOENT"
    ) {
      throw error;
    }
  }

  for (const slug of slugs) {
    const sourcePath = path.join(tipCoverSourceDirectory, `${slug}.jpg`);
    try {
      await access(sourcePath);
    } catch {
      missing += 1;
      continue;
    }

    try {
      const input = await readFile(sourcePath);
      if (input.byteLength === 0) {
        throw new Error("The source image is empty.");
      }

      const sourceImage = sharp(input, {
        failOn: "error",
        limitInputPixels: 100_000_000,
      });
      const sourceMetadata = await sourceImage.metadata();
      if (
        sourceMetadata.format !== "jpeg" ||
        !sourceMetadata.width ||
        !sourceMetadata.height
      ) {
        throw new Error("The source is not a complete, dimensioned JPEG.");
      }

      const converted = await sharp(input, {
        failOn: "error",
        limitInputPixels: 100_000_000,
      })
        .rotate()
        .resize({
          width: 1024,
          height: 1024,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 78 })
        .toBuffer({ resolveWithObject: true });
      const { data, info } = converted;
      if (
        data.byteLength === 0 ||
        info.format !== "webp" ||
        info.width < 1 ||
        info.height < 1 ||
        info.width > 1024 ||
        info.height > 1024
      ) {
        throw new Error("The compressed WebP failed validation.");
      }

      const objectPath = `tip-covers/${slug}.webp`;
      const contentHash = sha256(data);
      const file = getPublicObjectFile(objectPath);
      const [exists] = await file.exists();
      let shouldUpload = true;

      if (exists) {
        const [metadata] = await file.getMetadata();
        if (
          Number(metadata.size) === data.byteLength &&
          metadata.metadata?.tipCoverSha256 === contentHash
        ) {
          shouldUpload = false;
        } else if (Number(metadata.size) === data.byteLength) {
          const [currentBytes] = await file.download();
          if (sha256(currentBytes) === contentHash) {
            await file.setMetadata({
              contentType: "image/webp",
              cacheControl: "public, max-age=31536000, immutable",
              metadata: { tipCoverSha256: contentHash },
            });
            shouldUpload = false;
          }
        }
      }

      if (shouldUpload) {
        await file.save(data, {
          resumable: false,
          metadata: {
            contentType: "image/webp",
            cacheControl: "public, max-age=31536000, immutable",
            metadata: { tipCoverSha256: contentHash },
          },
        });
        uploaded += 1;
      } else {
        skippedExisting += 1;
      }

      const entry: TipCoverManifestEntry = {
        slug,
        objectPath,
        bytes: data.byteLength,
        sha256: contentHash,
      };
      if (!(await verifyManifestObject(entry))) {
        throw new Error("Uploaded object did not pass its remote verification.");
      }
      assetsBySlug.set(slug, entry);
    } catch (error) {
      invalid += 1;
      process.stderr.write(
        `Skipped incomplete tip cover ${slug}: ${String(error)}\n`,
      );
    }
  }

  const assets = [...assetsBySlug.values()];
  await writeTipCoverManifest(assets);
  const summary = {
    expected: EXPECTED_TIP_COVER_COUNT,
    sourceFilesMissing: missing,
    sourceFilesInvalid: invalid,
    uploaded,
    skippedExisting,
    verified: assets.length,
    complete: assets.length === EXPECTED_TIP_COVER_COUNT,
    manifest: ".local/tip-cover-upload-manifest.json",
  };
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  if (invalid > 0) {
    process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`Tip cover upload failed: ${String(error)}\n`);
  process.exitCode = 1;
});