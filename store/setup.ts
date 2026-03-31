import { getSetting } from "@/db/operations";
import { create } from "zustand";

interface SetupStore {
  setupStatus: "loading" | "new" | "done";
  checkSetup: () => Promise<void>;
  completeSetup: () => void;
}

export const useSetupStore = create<SetupStore>((set) => ({
  setupStatus: "loading",

  checkSetup: async () => {
    const result = await getSetting("setup_complete");
    set({ setupStatus: result?.value === "1" ? "done" : "new" });
  },

  completeSetup: () => set({ setupStatus: "done" }),
}));
