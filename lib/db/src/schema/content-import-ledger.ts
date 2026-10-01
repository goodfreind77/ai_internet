import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const contentImportLedgerTable = pgTable("content_import_ledger", {
  importKey: text("import_key").primaryKey(),
  importedCount: integer("imported_count").notNull(),
  skippedCount: integer("skipped_count").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});