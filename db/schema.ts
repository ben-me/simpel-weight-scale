import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const weightTable = sqliteTable("weight", {
  id: int().primaryKey({ autoIncrement: true }),
  date: text().unique().notNull(),
  weight: real(),
  unit: text().notNull().default("KG"),
});

export const settings = sqliteTable("settings", {
  id: int().primaryKey({ autoIncrement: true }),
  key: text().unique().notNull(),
  value: int().notNull(),
});

export type DataEntry = typeof weightTable.$inferSelect;
