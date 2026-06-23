import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import uzCommon from "./uz/common.json";
import enCommon from "./en/common.json";
import ruCommon from "./ru/common.json";

import uzAuth from "./uz/auth.json";
import enAuth from "./en/auth.json";
import ruAuth from "./ru/auth.json";

import uzProfile from "./uz/profile.json";
import enProfile from "./en/profile.json";
import ruProfile from "./ru/profile.json";

import uzShop from "./uz/shop.json";
import enShop from "./en/shop.json";
import ruShop from "./ru/shop.json";

export const defaultNS = "common";

export const resources = {
  uz: { common: uzCommon, auth: uzAuth, profile: uzProfile, shop: uzShop },
  en: { common: enCommon, auth: enAuth, profile: enProfile, shop: enShop },
  ru: { common: ruCommon, auth: ruAuth, profile: ruProfile, shop: ruShop },
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
