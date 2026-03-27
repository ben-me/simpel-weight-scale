export type AnchorDay = (typeof ANCHOR_DAYS)[number];

export const ANCHOR_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export function getAnchorDayNumber(anchor_day: AnchorDay) {
  return ANCHOR_DAYS.findIndex((entry) => anchor_day === entry);
}
