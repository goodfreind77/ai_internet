import { createHash } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { contentImportLedgerTable, db, managedTipsTable } from "@workspace/db";
import { logger } from "./logger";

const IMPORT_KEY = "zero-tip-view-fill-150-400-v1";

export async function fillZeroTipViewCounts(): Promise<void> {
  // A one-time data update for both development and published databases.
  // Existing nonzero counters and later admin edits must remain unchanged.
  await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(7492061186)`);
    const [done] = await tx.select()
      .from(contentImportLedgerTable)
      .where(eq(contentImportLedgerTable.importKey, IMPORT_KEY)).limit(1);
    if (done) {
      logger.info({ alreadyCompleted: true }, "Zero-view tip fill already recorded");
      return;
    }
    const zeroTips = await tx.select({ slug: managedTipsTable.slug })
      .from(managedTipsTable)
      .where(and(eq(managedTipsTable.views, 0), eq(managedTipsTable.isPublished, true)));
    const adjustments = zeroTips.map((tip) => ({
      slug: tip.slug,
      views: 150 + createHash("sha256")
        .update(`imported-tip-views:${tip.slug}`)
        .digest()
        .readUInt32BE(0) % 251,
    }));
    const changed = await tx.execute(sql`
      UPDATE ${managedTipsTable} AS tip
      SET views = adjustment.views
      FROM jsonb_to_recordset(${JSON.stringify(adjustments)}::jsonb)
        AS adjustment(slug text, views integer)
      WHERE tip.slug = adjustment.slug AND tip.is_published = true AND tip.views = 0
      RETURNING tip.slug
    `);
    await tx.insert(contentImportLedgerTable).values({
      importKey: IMPORT_KEY,
      importedCount: changed.rows.length,
      skippedCount: adjustments.length - changed.rows.length,
    });
    logger.info(
      { updated: changed.rows.length, targeted: adjustments.length, minViews: 150, maxViews: 400 },
      "Zero-view tips filled; nonzero counters, publication dates and article bodies unchanged",
    );
  });
}