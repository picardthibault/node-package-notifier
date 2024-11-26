import i18n from 'i18next';
import fsBackend from 'i18next-fs-backend';
import * as path from 'path';

void i18n
.use(fsBackend)
.init({
    initAsync: false,
    fallback: 'en',
    lng: 'en',
    interpolation: {
        escapeValue: false,
    },
    backend: {
        loadPath: path.join(__dirname, 'ressources', 'locales', '{{lng}}.json'),
    },
});

export default i18n;