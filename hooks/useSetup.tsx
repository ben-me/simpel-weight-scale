import { getSetting } from "@/db/operations";
import { useEffect, useState } from "react";

export function useSetup() {
  const [status, setStatus] = useState<"loading" | "new" | "done">("loading");

  useEffect(() => {
    const check = async () => {
      const result = await getSetting("setup_complete");
      setStatus(result?.value === "1" ? "done" : "new");
    };
    check();
  }, []);

  return status;
}
