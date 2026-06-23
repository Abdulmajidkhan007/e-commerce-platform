import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uzCommon from "./uz/common.json";
import enCommon from "./en/common.json";
import ruCommon from "./ru/common.json";

export const defaultNS = "common";

export const resources = {
  uz: { common: uzCommon },
  en: { common: enCommon },
  ru: { common: ruCommon },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    fallbackLng: "uz",
    supportedLngs: ["uz", "en", "ru"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "kidswear_lang",
      caches: ["localStorage"],
    },
  });

export default i18n;
