import { eq, sql } from "drizzle-orm";
import {
  contentImportLedgerTable,
  db,
  managedTipsTable,
} from "@workspace/db";
import { logger } from "./logger";
import sourceTips from "../data/source-tips.json";
import coverRelease from "../data/tip-cover-release.json";

const THUMBNAIL_IMPORT_KEY = "tip-cover-thumbnails-v1";
const THUMBNAIL_ADVISORY_LOCK_KEY = 7_492_061_185;
const SOURCE_IMPORT_KEY = "authorized-source-tips-v1";
const LEGACY_TIP_COVER_SLUGS = [
  "why-us",
  "lg-discount",
  "kt-discount",
  "sk-discount",
  "new-vs-renewal",
  "84",
] as const;
const MANAGED_TIP_COUNT = 179;
const TOTAL_TIP_COVER_COUNT =
  MANAGED_TIP_COUNT + LEGACY_TIP_COVER_SLUGS.length;
const PUBLIC_COVER_PATH = "/api/storage/public-objects/tip-covers";

type TipCoverReleaseAsset = {
  slug: string;
  objectPath: string;
};

type TipCoverRelease = {
  enabled: boolean;
  assets: TipCoverReleaseAsset[];
};

function getVerifiedReleaseAssets(): TipCoverReleaseAsset[] {
  const release = coverRelease as TipCoverRelease;
  if (release.enabled !== true) {
    return [];
  }

  if (!Array.isArray(sourceTips) || sourceTips.length !== MANAGED_TIP_COUNT) {
    throw new Error(
      `Expected exactly ${MANAGED_TIP_COUNT} managed tips for cover release.`,
    );
  }

  const managedSlugs = sourceTips.map((tip) => {
    if (
      typeof tip.id !== "string" ||
      typeof tip.slug !== "string" ||
      tip.id !== tip.slug ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        tip.slug,
      )
    ) {
      throw new Error("A managed tip has an invalid UUID slug.");
    }
    return tip.slug;
  });
  const knownSlugs = new Set([
    ...managedSlugs,
    ...LEGACY_TIP_COVER_SLUGS,
  ]);
  if (
    new Set(managedSlugs).size !== MANAGED_TIP_COUNT ||
    knownSlugs.size !== TOTAL_TIP_COVER_COUNT
  ) {
    throw new Error("Tip cover source slugs must be unique.");
  }

  if (
    !Array.isArray(release.assets) ||
    release.assets.length !== TOTAL_TIP_COVER_COUNT
  ) {
    throw new Error(
      `Enabled tip cover release must contain exactly ${TOTAL_TIP_COVER_COUNT} assets.`,
    );
  }

  const releasedSlugs = new Set<string>();
  for (const asset of release.assets) {
    if (
      !asset ||
      typeof asset.slug !== "string" ||
      typeof asset.objectPath !== "string" ||
      !knownSlugs.has(asset.slug) ||
      releasedSlugs.has(asset.slug) ||
      !(
        asset.objectPath === `${PUBLIC_COVER_PATH}/${asset.slug}.webp` ||
        (
          asset.objectPath.startsWith(`${PUBLIC_COVER_PATH}/${asset.slug}.webp?v=`) &&
          /^[a-f0-9]{12}$/.test(
            asset.objectPath.slice(`${PUBLIC_COVER_PATH}/${asset.slug}.webp?v=`.length),
          )
        )
      )
    ) {
      throw new Error(
        "Enabled tip cover release has an unknown, duplicate, or invalid public object path.",
      );
    }
    releasedSlugs.add(asset.slug);
  }
  if (releasedSlugs.size !== knownSlugs.size) {
    throw new Error("Enabled tip cover release is missing one or more expected assets.");
  }

  return release.assets;
}

export async function importGeneratedTipCovers(): Promise<void> {
  if (coverRelease.enabled !== true) {
    return;
  }

  const releaseAssets = getVerifiedReleaseAssets();
  const assetBySlug = new Map(
    releaseAssets.map((asset) => [asset.slug, asset]),
  );
  const managedUpdates = sourceTips.map((tip) => ({
    slug: tip.slug,
    thumbnail: assetBySlug.get(tip.slug)?.objectPath,
  }));
  if (managedUpdates.some((asset) => !asset.thumbnail)) {
    throw new Error("Enabled tip cover release does not cover all managed tips.");
  }

  await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${THUMBNAIL_ADVISORY_LOCK_KEY})`);

    const [completedImport] = await tx
      .select({ importKey: contentImportLedgerTable.importKey })
      .from(contentImportLedgerTable)
      .where(eq(contentImportLedgerTable.importKey, THUMBNAIL_IMPORT_KEY))
      .limit(1);
    if (completedImport) {
      logger.info(
        { targeted: MANAGED_TIP_COUNT, updated: 0, alreadyCompleted: true },
        "Tip cover thumbnail seed already recorded; leaving existing thumbnails unchanged",
      );
      return;
    }

    const [sourceImport] = await tx
      .select({ importKey: contentImportLedgerTable.importKey })
      .from(contentImportLedgerTable)
      .where(eq(contentImportLedgerTable.importKey, SOURCE_IMPORT_KEY))
      .limit(1);
    if (!sourceImport) {
      throw new Error(
        "Authorized source tip import is not recorded; refusing cover thumbnail seed.",
      );
    }

    const changed = await tx.execute(sql`
      UPDATE ${managedTipsTable} AS tip
      SET thumbnail = covers.thumbnail
      FROM jsonb_to_recordset(${JSON.stringify(managedUpdates)}::jsonb)
        AS covers(slug text, thumbnail text)
      WHERE tip.slug = covers.slug
      RETURNING tip.slug
    `);
    const updated = changed.rows.length;
    await tx.insert(contentImportLedgerTable).values({
      importKey: THUMBNAIL_IMPORT_KEY,
      importedCount: updated,
      skippedCount: MANAGED_TIP_COUNT - updated,
    });

    logger.info(
      {
        targeted: MANAGED_TIP_COUNT,
        updated,
        missingOrDeletedLeftUntouched: MANAGED_TIP_COUNT - updated,
        alreadyCompleted: false,
      },
      "Generated tip cover thumbnails seeded",
    );
  });
}