import { getSetting, insertSetting } from "@/db/operations";
import { create } from "zustand";

interface UnitStore {
  unit: "KG" | "lbs";
  initUnit: () => Promise<void>;
  updateUnit: (unit: UnitStore["unit"]) => Promise<void>;
}

export const useUnit = create<UnitStore>((set, get) => ({
  unit: "KG",

  initUnit: async () => {
    const dbUnit = await getSetting("unit");
    set({ unit: dbUnit?.value as "KG" | "lbs" });
  },

  updateUnit: async (newUnit) => {
    if (get().unit === newUnit) return;
    await insertSetting({ key: "unit", value: newUnit });
    set({ unit: newUnit });
  },
}));
