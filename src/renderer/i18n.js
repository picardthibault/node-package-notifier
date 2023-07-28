import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as translationEn from './public/locales/translation-en.json';

i18n
.use(initReactI18next)
.init({
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