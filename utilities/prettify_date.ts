/**
 * @constructor
 * @param {string} date - Date String with format 'YYYY-MM-DD'
 * @returns
 */

export function prettifyDate(date: string) {
  const [year, month, day] = date.split("-");
  const formatted_display_date = new Date(+year, +month - 1, +day).toLocaleDateString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return formatted_display_date;
}
