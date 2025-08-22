import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  level: integer("level").notNull(),
  funds: integer("funds").notNull().default(0),
  avatarUrl: text("avatar_url").notNull(),
  lastUpdated: text("last_updated").notNull().default(sql`now()`),
  isBank: text("is_bank").default("false"),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  lastUpdated: true,
  isBank: true,
});

export const updateProfileSchema = createInsertSchema(profiles).pick({
  funds: true,
}).extend({
  funds: z.number().min(0).max(999999999),
});

export const transferFundsSchema = z.object({
  fromId: z.string(),
  toId: z.string(),
  amount: z.number().min(0).max(999999999),
});

export const updateProfileNameSchema = createInsertSchema(profiles).pick({
  name: true,
}).extend({
  name: z.string().min(1).max(50),
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type UpdateProfile = z.infer<typeof updateProfileSchema>;
export type UpdateProfileName = z.infer<typeof updateProfileNameSchema>;
export type TransferFunds = z.infer<typeof transferFundsSchema>;
export type Profile = typeof profiles.$inferSelect;
