import { getSetting, insertSetting } from "@/db/operations";
import { create } from "zustand";

interface SetupStore {
  setupStatus: "loading" | "new" | "done";
  checkSetup: () => Promise<"done" | "new">;
  completeSetup: () => Promise<void>;
}

export const useSetupStore = create<SetupStore>((set) => ({
  setupStatus: "loading",

  checkSetup: async () => {
    const result = await getSetting("setup_complete");
    set({ setupStatus: result?.value === "1" ? "done" : "new" });
    return result?.value === "1" ? "done" : "new";
  },

  completeSetup: async () => {
    await insertSetting({ key: "setup_complete", value: "1" });
    set({ setupStatus: "done" });
  },
}));
