import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const reminders = pgTable("reminders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 40 }).notNull(),
  message: varchar("message", { length: 120 }).notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  recurrence: text("recurrence", { enum: ["none", "daily", "weekly", "monthly"] }).notNull(),
  completionAlerts: boolean("completion_alerts").notNull().default(false),
  customNotificationEmail: text("custom_notification_email"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertReminderSchema = createInsertSchema(reminders).omit({
  id: true,
  createdAt: true,
});

export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type Reminder = typeof reminders.$inferSelect;
