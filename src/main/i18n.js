import i18n from 'i18next';
import fsBackend from 'i18next-fs-backend';
import * as path from 'path';

i18n
.use(fsBackend)
.init({
    fallback: 'en',
    lng: 'en',
    backend: {
        loadPath: path.join(__dirname, 'ressources', 'locales', '{{lng}}.json'),
    },
});

export default i18n;