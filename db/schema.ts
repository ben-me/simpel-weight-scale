import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const weightTable = sqliteTable("weight", {
  date: text().primaryKey(),
  weight: real(),
  unit: text().notNull().default("KG"),
});

export const settings = sqliteTable("settings", {
  key: text().primaryKey(),
  value: int().notNull(),
});

export type WeightTableEntry = typeof weightTable.$inferSelect;
export type SettingTableEntry = typeof settings.$inferSelect;
