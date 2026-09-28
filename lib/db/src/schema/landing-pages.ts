import { boolean, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const landingPagesTable = pgTable("landing_pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 30 }).notNull(),
  eyebrow: varchar("eyebrow", { length: 120 }).notNull().default(""),
  headline: varchar("headline", { length: 200 }).notNull(),
  description: text("description").notNull().default(""),
  benefits: text("benefits").notNull().default(""),
  ctaLabel: varchar("cta_label", { length: 100 }).notNull().default("상담 신청하기"),
  ctaUrl: text("cta_url").notNull().default("/apply"),
  imageUrl: text("image_url"),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLandingPageSchema = createInsertSchema(landingPagesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type LandingPage = z.infer<typeof insertLandingPageSchema>;