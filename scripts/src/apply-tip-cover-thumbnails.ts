import { pool } from "@workspace/db";
import {
  EXPECTED_TIP_COVER_COUNT,
  getExpectedTipCoverSlugs,
  MANAGED_TIP_COVER_COUNT,
  readTipCoverManifest,
  tipCoverDatabaseUrl,
  verifyManifestObject,
} from "./tip-cover-assets";

const THUMBNAIL_IMPORT_KEY = "tip-cover-thumbnails-v1";
const THUMBNAIL_ADVISORY_LOCK_KEY = 7_492_061_185;
const SOURCE_IMPORT_KEY = "authorized-source-tips-v1";
const REMOTE_VERIFY_CONCURRENCY = 8;

async function verifyAllAssets(): Promise<string[]> {
  if (process.env.TIP_COVERS_VERIFIED !== String(EXPECTED_TIP_COVER_COUNT)) {
    throw new Error(
      `Refusing database update: set TIP_COVERS_VERIFIED=${EXPECTED_TIP_COVER_COUNT} only after confirming all generated covers are complete.`,
    );
  }

  const expectedSlugs = await getExpectedTipCoverSlugs();
  const expectedSet = new Set(expectedSlugs);
  const manifest = await readTipCoverManifest();
  if (
    manifest.assets.length !== EXPECTED_TIP_COVER_COUNT ||
    manifest.assets.some((entry) => !expectedSet.has(entry.slug)) ||
    expectedSet.size !== EXPECTED_TIP_COVER_COUNT
  ) {
    throw new Error(
      `Refusing database update: upload manifest must contain all ${EXPECTED_TIP_COVER_COUNT} distinct expected covers.`,
    );
  }

  for (
    let offset = 0;
    offset < manifest.assets.length;
    offset += REMOTE_VERIFY_CONCURRENCY
  ) {
    const batch = manifest.assets.slice(
      offset,
      offset + REMOTE_VERIFY_CONCURRENCY,
    );
    const verified = await Promise.all(
      batch.map(async (entry) => ({
        slug: entry.slug,
        ok: await verifyManifestObject(entry),
      })),
    );
    const missing = verified.filter((entry) => !entry.ok).map((entry) => entry.slug);
    if (missing.length > 0) {
      throw new Error(
        `Refusing database update: remote cover verification failed for ${missing.length} asset(s).`,
      );
    }
  }

  return expectedSlugs;
}

async function main(): Promise<void> {
  const expectedSlugs = await verifyAllAssets();
  const importedManagedSlugs = expectedSlugs.slice(0, MANAGED_TIP_COVER_COUNT);
  const client = await pool.connect();
  let transactionOpen = false;
  let result:
    | { status: string; updated: number; skipped: number }
    | undefined;

  try {
    await client.query("BEGIN");
    transactionOpen = true;
    await client.query("SELECT pg_advisory_xact_lock($1)", [
      THUMBNAIL_ADVISORY_LOCK_KEY,
    ]);

    const schemaResult = await client.query<{
      ledger_exists: boolean;
      tips_exist: boolean;
    }>(
      `SELECT
        to_regclass('public.content_import_ledger') IS NOT NULL AS ledger_exists,
        to_regclass('public.managed_tips') IS NOT NULL AS tips_exist`,
    );
    const schema = schemaResult.rows[0];
    if (!schema?.ledger_exists || !schema.tips_exist) {
      result = {
        status: "schema-unavailable",
        updated: 0,
        skipped: importedManagedSlugs.length,
      };
      await client.query("ROLLBACK");
      transactionOpen = false;
    } else {
      const existingImport = await client.query(
        `SELECT import_key
         FROM content_import_ledger
         WHERE import_key = $1
         LIMIT 1`,
        [THUMBNAIL_IMPORT_KEY],
      );
      if (existingImport.rowCount) {
        result = {
          status: "already-applied",
          updated: 0,
          skipped: importedManagedSlugs.length,
        };
        await client.query("COMMIT");
        transactionOpen = false;
      } else {
        const sourceImport = await client.query(
          `SELECT import_key
           FROM content_import_ledger
           WHERE import_key = $1
           LIMIT 1`,
          [SOURCE_IMPORT_KEY],
        );
        if (!sourceImport.rowCount) {
          throw new Error(
            "The authorized source tips import has not been recorded; refusing thumbnail update.",
          );
        }

        const updates = importedManagedSlugs.map((slug) => ({
          slug,
          thumbnail: tipCoverDatabaseUrl(slug),
        }));
        const updatedRows = await client.query(
          `UPDATE managed_tips AS tip
           SET thumbnail = covers.thumbnail
           FROM jsonb_to_recordset($1::jsonb)
             AS covers(slug text, thumbnail text)
           WHERE tip.slug = covers.slug
           RETURNING tip.slug`,
          [JSON.stringify(updates)],
        );
        const updated = updatedRows.rowCount ?? 0;
        const skipped = importedManagedSlugs.length - updated;

        await client.query(
          `INSERT INTO content_import_ledger
             (import_key, imported_count, skipped_count)
           VALUES ($1, $2, $3)`,
          [THUMBNAIL_IMPORT_KEY, updated, skipped],
        );
        await client.query("COMMIT");
        transactionOpen = false;
        result = { status: "applied", updated, skipped };
      }
    }
  } catch (error) {
    if (transactionOpen) {
      await client.query("ROLLBACK");
    }
    throw error;
  } finally {
    client.release();
  }

  if (!result) {
    throw new Error("Tip cover thumbnail seed did not produce a result.");
  }

  process.stdout.write(
    `${JSON.stringify(
      {
        ...result,
        targetedManagedTips: importedManagedSlugs.length,
        thumbnailsChanged: result.updated,
        missingOrDeletedTipsLeftUntouched: result.skipped,
      },
      null,
      2,
    )}\n`,
  );
}

main()
  .catch((error: unknown) => {
    process.stderr.write(`Tip cover thumbnail update failed: ${String(error)}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });