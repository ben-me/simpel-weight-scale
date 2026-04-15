/**
 * @param {string} date - Date String with format 'YYYY-MM-DD'
 * @returns A date string looking like "Mo., 31.12.2025"
 */

import { useTranslation } from "react-i18next";

export function prettifyDate(date: string) {
  const { i18n } = useTranslation();
  const [year, month, day] = date.split("-");
  const formatted_display_date = new Date(+year, +month - 1, +day).toLocaleDateString(
    i18n.language,
    {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );
  return formatted_display_date;
}
