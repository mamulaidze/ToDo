import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ge from "./locales/ge.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ge: { translation: ge },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
