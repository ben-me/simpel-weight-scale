import { desc, eq, sql } from "drizzle-orm";

import { db, opsqliteDB } from ".";
import { WeightTableEntry, settings, weightTable, SettingTableEntry } from "./schema";

export async function getWeights() {
  return await db.query.weightTable.findMany({
    orderBy: desc(weightTable.date),
  });
}

export async function getSingleWeight(date: string) {
  return await db.query.weightTable.findFirst({
    where: eq(weightTable.date, date),
  });
}

export async function insertWeight(value: WeightTableEntry) {
  await opsqliteDB.transaction(async () => {
    await db
      .insert(weightTable)
      .values(value)
      .onConflictDoUpdate({
        target: weightTable.date,
        set: {
          weight: value.weight,
          unit: value.unit,
        },
      });
  });
}

export async function insertMultipleWeights(list: WeightTableEntry[]) {
  await opsqliteDB.transaction(async () => {
    await db
      .insert(weightTable)
      .values(list)
      .onConflictDoUpdate({
        target: weightTable.date,
        set: {
          weight: sql.raw(`excluded.${weightTable.weight.name}`),
          unit: sql.raw(`excluded.${weightTable.unit.name}`),
        },
      });
  });
}

export async function getSetting(key: string) {
  return await db.query.settings.findFirst({
    where: eq(settings.key, key),
  });
}

export async function getSettings() {
  return await db.query.settings.findMany();
}

export async function clearWeightTable() {
  await opsqliteDB.transaction(async () => {
    await db.delete(weightTable);
  });
}

export async function insertSetting(setting: SettingTableEntry) {
  await opsqliteDB.transaction(async () => {
    await db
      .insert(settings)
      .values(setting)
      .onConflictDoUpdate({ target: settings.key, set: { value: setting.value } });
  });
}
