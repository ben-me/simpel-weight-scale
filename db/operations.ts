import { desc, eq, sql } from "drizzle-orm";

import { db, opsqliteDB } from ".";
import { WeightTableEntry, settings, weightTable, SettingTableEntry } from "./schema";

export async function getWeights() {
  let result: WeightTableEntry[] = [];
  await opsqliteDB.transaction(async () => {
    result = await db.select().from(weightTable).orderBy(desc(weightTable.date));
  });
  return result;
}

export async function getSingleWeight(date: string) {
  let result: WeightTableEntry | undefined;
  await opsqliteDB.transaction(async () => {
    result = await db.query.weightTable.findFirst({
      where: eq(weightTable.date, date),
    });
  });
  return result;
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
  let setting: SettingTableEntry[] = [];
  await opsqliteDB.transaction(async () => {
    setting = await db.select().from(settings).where(eq(settings.key, key));
  });

  return setting[0];
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
