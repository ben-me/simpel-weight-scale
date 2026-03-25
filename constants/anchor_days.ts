export type AnchorDay = (typeof ANCHOR_DAYS)[number];

export const ANCHOR_DAYS = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
] as const;

export function getAnchorDayNumber(anchor_day: AnchorDay) {
  return ANCHOR_DAYS.findIndex((entry) => anchor_day === entry);
}
