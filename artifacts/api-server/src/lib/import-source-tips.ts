import { eq, sql } from "drizzle-orm";
import {
  contentImportLedgerTable,
  db,
  managedTipsTable,
} from "@workspace/db";
import { logger } from "./logger";
import sourceTips from "../data/source-tips.json";

const IMPORT_KEY = "authorized-source-tips-v1";
const ADVISORY_LOCK_KEY = 7_492_061_183;
const IMAGE_ONLY_SOURCE_TIP_ID = "abebebee-65e0-40c9-8f9e-71acbff7cd4c";

type ImportedTip = {
  id: string;
  slug: string;
  title: string;
  category: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

function getImportedDataset(): ImportedTip[] {
  if (!Array.isArray(sourceTips) || sourceTips.length !== 179) {
    throw new Error(`Expected a bundled dataset of 179 tips; found ${sourceTips.length}.`);
  }

  const ids = new Set<string>();
  return sourceTips.map((tip, index) => {
    if (
      !tip ||
      typeof tip.id !== "string" ||
      typeof tip.slug !== "string" ||
      typeof tip.title !== "string" ||
      typeof tip.category !== "string" ||
      typeof tip.content !== "string" ||
      typeof tip.createdAt !== "string" ||
      typeof tip.updatedAt !== "string"
    ) {
      throw new Error(`Bundled tip at index ${index} has an invalid shape.`);
    }
    if (tip.id !== tip.slug) {
      throw new Error(`Bundled tip ${tip.id} does not use its UUID as its slug.`);
    }
    if (!tip.title.trim() || !tip.category.trim() || !tip.content.trim()) {
      throw new Error(`Bundled tip ${tip.id} has empty required content.`);
    }
    if (!tip.content.startsWith("<!-- aiinternet-html -->")) {
      throw new Error(`Bundled tip ${tip.id} is missing the rich HTML marker.`);
    }
    if (
      tip.id === IMAGE_ONLY_SOURCE_TIP_ID &&
      !tip.content
        .replace("<!-- aiinternet-html -->", "")
        .replace(/<[^>]*>/g, "")
        .trim()
    ) {
      throw new Error(
        `Tip ${IMAGE_ONLY_SOURCE_TIP_ID} is missing its transcribed article text; refusing to import an empty body.`,
      );
    }
    if (ids.has(tip.id)) {
      throw new Error(`Bundled dataset contains duplicate id ${tip.id}.`);
    }
    ids.add(tip.id);

    const createdAt = new Date(tip.createdAt);
    const updatedAt = new Date(tip.updatedAt);
    if (Number.isNaN(createdAt.getTime()) || Number.isNaN(updatedAt.getTime())) {
      throw new Error(`Bundled tip ${tip.id} has an invalid source date.`);
    }

    return tip;
  });
}

export async function importAuthorizedSourceTips(): Promise<void> {
  const dataset = getImportedDataset();

  await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${ADVISORY_LOCK_KEY})`);

    const [completedImport] = await tx
      .select({ importKey: contentImportLedgerTable.importKey })
      .from(contentImportLedgerTable)
      .where(eq(contentImportLedgerTable.importKey, IMPORT_KEY))
      .limit(1);

    if (completedImport) {
      logger.info(
        {
          acquired: dataset.length,
          imported: 0,
          skipped: dataset.length,
          alreadyCompleted: true,
        },
        "Authorized source tips import already recorded; leaving existing content unchanged",
      );
      return;
    }

    const existingTips = await tx
      .select({ slug: managedTipsTable.slug, title: managedTipsTable.title })
      .from(managedTipsTable);
    const existingSlugs = new Set(existingTips.map((tip) => tip.slug));
    const existingTitles = new Set(existingTips.map((tip) => tip.title));

    const rowsToInsert = [];
    let skipped = 0;
    for (const tip of dataset) {
      if (existingSlugs.has(tip.slug) || existingTitles.has(tip.title)) {
        skipped += 1;
        continue;
      }

      rowsToInsert.push({
        title: tip.title,
        slug: tip.slug,
        category: tip.category,
        content: tip.content,
        thumbnail: null,
        views: 0,
        isFeatured: false,
        isPublished: true,
        createdAt: new Date(tip.createdAt),
        updatedAt: new Date(tip.updatedAt),
      });
      existingSlugs.add(tip.slug);
      existingTitles.add(tip.title);
    }

    if (rowsToInsert.length > 0) {
      await tx.insert(managedTipsTable).values(rowsToInsert);
    }

    await tx.insert(contentImportLedgerTable).values({
      importKey: IMPORT_KEY,
      importedCount: rowsToInsert.length,
      skippedCount: skipped,
    });

    logger.info(
      {
        acquired: dataset.length,
        imported: rowsToInsert.length,
        skipped,
        alreadyCompleted: false,
      },
      "Authorized source tips import completed",
    );
  });
}