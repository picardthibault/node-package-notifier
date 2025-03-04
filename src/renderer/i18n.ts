import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from './utils/locales/translation-en.json';

void i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: translationEn,
    },
  },
});

export default i18n;
