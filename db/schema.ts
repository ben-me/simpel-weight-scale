import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const weightTable = sqliteTable("weight", {
  date: text("date").primaryKey(),
  weight: real("weight"),
  unit: text("unit").notNull().default("KG"),
});

export type DataEntry = typeof weightTable.$inferSelect;
