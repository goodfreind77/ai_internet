import { eq, sql } from "drizzle-orm";
import { contentImportLedgerTable, db, managedTipsTable } from "@workspace/db";
import sourceTips from "../data/source-tips.json";
import { logger } from "./logger";

const SCHEDULE_KEY = "tip-publication-dates-2025-11-25-to-2026-10-01";
const LEGACY_COUNT = 6;
const DAY_MS = 86_400_000;
const START = Date.UTC(2025, 10, 25);
const END = Date.UTC(2026, 9, 1);

export function getTipPublicationSchedule() {
  // Older source posts remain older. Reverse tied source positions to preserve
  // the original newest-first ordering when every post receives a unique date.
  const oldestFirst = sourceTips
    .map((tip, position) => ({ ...tip, position }))
    .sort((a, b) =>
      Date.parse(a.createdAt) - Date.parse(b.createdAt) || b.position - a.position);
  const total = oldestFirst.length + LEGACY_COUNT;
  return oldestFirst.map((tip, index) => ({
    slug: tip.slug,
    published_at: new Date(
      START + Math.round(((END - START) / DAY_MS) * (index + LEGACY_COUNT) / (total - 1)) * DAY_MS,
    ).toISOString(),
  }));
}

export async function scheduleTipPublicationDates(): Promise<void> {
  const schedule = getTipPublicationSchedule();
  await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(7492061184)`);
    const [done] = await tx.select()
      .from(contentImportLedgerTable)
      .where(eq(contentImportLedgerTable.importKey, SCHEDULE_KEY)).limit(1);
    if (done) return;

    // This is a one-time content update, not a schema migration. Only publication
    // dates change; article text, thumbnails, visibility and edit dates stay intact.
    // Missing/deleted posts are not recreated, and later admin changes are retained.
    const changed = await tx.execute(sql`
      UPDATE ${managedTipsTable}
      SET created_at = schedule.published_at::timestamp
      FROM jsonb_to_recordset(${JSON.stringify(schedule)}::jsonb)
        AS schedule(slug text, published_at text)
      WHERE ${managedTipsTable.slug} = schedule.slug
      RETURNING ${managedTipsTable.id}
    `);
    const count = changed.rows.length;
    await tx.insert(contentImportLedgerTable).values({
      importKey: SCHEDULE_KEY,
      importedCount: count,
      skippedCount: schedule.length - count,
    });
    logger.info({ updated: count, start: "2025-11-25", end: "2026-10-01" },
      "Tip publication date schedule applied");
  });
}