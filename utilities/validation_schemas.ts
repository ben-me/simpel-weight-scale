import * as z from "zod";

export const Entry = z.object({
  date: z.iso.date(),
  weight: z.number(),
  unit: z.enum(["kg", "lbs"]),
});
