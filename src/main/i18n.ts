import i18n from 'i18next';
import en from './ressources/locales/en.json';

void i18n.init({
  fallbackLng: 'en',
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: en,
    },
  },
});

export default i18n;
