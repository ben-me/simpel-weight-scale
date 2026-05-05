import { create } from "zustand";
import { WeightTableEntry } from "@/db/schema";
import { getSetting, getWeights, insertSetting } from "@/db/operations";
import { opsqliteDB } from "@/db";
import { AnchorDay } from "@/constants/anchor_days";

type DataStore = {
  unit: "kg" | "lbs";
  weights: WeightTableEntry[];
  anchorDay: AnchorDay;
  initialized: boolean;
  init: () => Promise<() => void>;
  setAnchorDay: (newDay: AnchorDay) => Promise<void>;
  updateUnit: (newUnit: DataStore["unit"]) => Promise<void>;
};

export const useDataStore = create<DataStore>((set) => ({
  unit: "kg",
  weights: [],
  anchorDay: "monday",
  initialized: false,
  init: async () => {
    try {
      const weights = await getWeights();
      const anchorSetting = await getSetting("anchor_day");
      const unitSetting = await getSetting("unit");
      set({
        weights,
        anchorDay: anchorSetting?.value as AnchorDay,
        unit: unitSetting?.value as "kg" | "lbs",
        initialized: true,
      });
    } catch (e) {
      console.error(e);
    }

    const reactive_query = opsqliteDB.reactiveExecute({
      query: "SELECT * FROM weight ORDER BY date DESC",
      fireOn: [{ table: "weight" }],
      arguments: [],
      callback: (res) => set({ weights: res.rows }),
    });

    return reactive_query;
  },
  setAnchorDay: async (day) => {
    await insertSetting({ key: "anchor_day", value: day });
    set({ anchorDay: day });
  },
  updateUnit: async (newUnit) => {
    if (useDataStore.getState().unit === newUnit) return;
    await insertSetting({ key: "unit", value: newUnit });
    useDataStore.setState({ unit: newUnit });
  },
}));
