import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const consultationRequestsTable = pgTable("consultation_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  status: varchar("status", { length: 20 }).default("처리중").notNull(),
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
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(
  applicationsTable,
).omit({ id: true, createdAt: true });
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
