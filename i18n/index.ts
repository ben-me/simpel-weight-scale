import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationDE from "./locales/de.json";
import translationEN from "./locales/en.json";
import { getSetting } from "@/db/operations";

export const resources = {
  de: { translation: translationDE },
  en: { translation: translationEN },
} as const;

const i18nInit = async () => {
  const setting = await getSetting("language").catch(() => null);
  const language = setting?.value ?? "en";

  i18n.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    showSupportNotice: false,
  });
};

i18nInit();

export default i18n;
