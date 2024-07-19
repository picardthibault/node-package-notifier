import i18n from 'i18next';
import fsBackend, { FsBackendOptions } from 'i18next-fs-backend';
import * as path from 'path';

i18n.use(fsBackend).init<FsBackendOptions>({
  initImmediate: false,
  fallbackLng: 'en',
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
  backend: {
    loadPath: path.join(
      path.dirname(__dirname),
      'src',
      'renderer',
      'public',
      'locales',
      'translation-{{lng}}.json',
    ),
  },
});
