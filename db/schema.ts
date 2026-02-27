import { real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const weightTable = sqliteTable("weight_table", {
  date: text("date").primaryKey(),
  weight: real("weight"),
  unit: text("unit"),
});
