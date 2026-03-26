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
  const language = (await getSetting("language"))?.value ?? "de";

  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "de",
    interpolation: {
      escapeValue: false,
    },
  });
};

i18nInit();

export default i18n;
