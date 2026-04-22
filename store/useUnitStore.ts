import { getSetting, insertSetting } from "@/db/operations";
import { create } from "zustand";

interface UnitStore {
  unit: "kg" | "lbs";
}

export const useUnitStore = create<UnitStore>(() => ({
  unit: "kg",
}));

export async function updateUnit(newUnit: UnitStore["unit"]) {
  if (useUnitStore.getState().unit === newUnit) return;
  await insertSetting({ key: "unit", value: newUnit });
  useUnitStore.setState({ unit: newUnit });
}

export async function initUnit() {
  const dbUnit = await getSetting("unit");
  useUnitStore.setState({ unit: dbUnit?.value as "kg" | "lbs" });
}
