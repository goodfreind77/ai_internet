import { boolean, integer, pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
export * from "./landing-pages";

export const consultationRequestsTable = pgTable("consultation_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).default("처리중").notNull(),
  landingSlug: varchar("landing_slug", { length: 100 }),
  preferredProvider: varchar("preferred_provider", { length: 20 }),
  consentedAt: timestamp("consented_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertConsultationSchema = createInsertSchema(
  consultationRequestsTable,
).omit({ id: true, createdAt: true });
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type ConsultationRequest = typeof consultationRequestsTable.$inferSelect;

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  currentProvider: varchar("current_provider", { length: 100 }),
  applyProvider: varchar("apply_provider", { length: 100 }),
  internet: varchar("internet", { length: 100 }),
  tv: varchar("tv", { length: 100 }),
  customerType: varchar("customer_type", { length: 50 }),
  paymentMethod: varchar("payment_method", { length: 50 }),
  payBank: varchar("pay_bank", { length: 50 }),
  payAccount: varchar("pay_account", { length: 100 }),
  payAccountHolder: varchar("pay_account_holder", { length: 100 }),
  cardCompany: varchar("card_company", { length: 50 }),
  cardNumber: varchar("card_number", { length: 50 }),
  cardExpiry: varchar("card_expiry", { length: 20 }),
  giftBank: varchar("gift_bank", { length: 50 }),
  giftAccount: varchar("gift_account", { length: 100 }),
  giftAccountHolder: varchar("gift_account_holder", { length: 100 }),
  name: varchar("name", { length: 100 }),
  phoneCarrier: varchar("phone_carrier", { length: 50 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 200 }),
  address: text("address"),
  memo: text("memo"),
  adminMemo: text("admin_memo"),
  consultationHistory: text("consultation_history"),
  status: varchar("status", { length: 20 }).default("처리중").notNull(),
  consentedAt: timestamp("consented_at"),
  receptionNotifiedAt: timestamp("reception_notified_at"),
  completionNotifiedAt: timestamp("completion_notified_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(
  applicationsTable,
).omit({ id: true, createdAt: true });
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;

export const adminAccountsTable = pgTable("admin_accounts", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 30 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("limited"),
  permissions: text("permissions").notNull().default("[]"),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type AdminAccount = typeof adminAccountsTable.$inferSelect;

export const adminResourcesTable = pgTable("admin_resources", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  fileUrl: text("file_url").notNull(),
  previewUrl: text("preview_url"),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAdminResourceSchema = createInsertSchema(
  adminResourcesTable,
).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAdminResource = z.infer<typeof insertAdminResourceSchema>;
export type AdminResource = typeof adminResourcesTable.$inferSelect;

export const managedReviewsTable = pgTable("managed_reviews", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  author: varchar("author", { length: 100 }).notNull(),
  content: text("content").notNull(),
  thumbnail: text("thumbnail"),
  views: integer("views").default(0).notNull(),
  isBest: boolean("is_best").default(false).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertManagedReviewSchema = createInsertSchema(
  managedReviewsTable,
).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertManagedReview = z.infer<typeof insertManagedReviewSchema>;
export type ManagedReview = typeof managedReviewsTable.$inferSelect;

export const managedTipsTable = pgTable("managed_tips", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  content: text("content").notNull(),
  thumbnail: text("thumbnail"),
  views: integer("views").default(0).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertManagedTipSchema = createInsertSchema(
  managedTipsTable,
).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertManagedTip = z.infer<typeof insertManagedTipSchema>;
export type ManagedTip = typeof managedTipsTable.$inferSelect;
