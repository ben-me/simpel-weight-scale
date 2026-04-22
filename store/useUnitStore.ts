import { getSetting, insertSetting } from "@/db/operations";
import { create } from "zustand";

interface UnitStore {
  unit: "kg" | "lbs";
  initUnit: () => Promise<void>;
  updateUnit: (unit: UnitStore["unit"]) => Promise<void>;
}

export const useUnitStore = create<UnitStore>((set, get) => ({
  unit: "kg",

  initUnit: async () => {
    const dbUnit = await getSetting("unit");
    set({ unit: dbUnit?.value as "kg" | "lbs" });
  },

  updateUnit: async (newUnit) => {
    if (get().unit === newUnit) return;
    await insertSetting({ key: "unit", value: newUnit });
    set({ unit: newUnit });
  },
}));
