import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';

const config: ForgeConfig = {
  packagerConfig: {
    name: 'node-package-notifier',
    icon: './src/main/ressources/logo',
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel(
      {
        setupIcon: './src/main/ressources/logo.ico',
      },
      ['win32'],
    ),
    {
      name: '@electron-forge/maker-wix',
      config: {
        icon: './src/main/ressources/logo.ico',
        description:
          'A simple Electron Js app that notify new npm package release.',
        exe: 'npn',
        manufacturer: 'Thibault Picard',
        name: 'node-package-notifier',
        shortName: 'npn',
        ui: {
          chooseDirectory: true,
        },
      },
    },
    {
      name: '@electron-forge/maker-appx',
      config: {
        identityName: 'Your Identity Name',
        packageDisplayName: 'node-package-notifier',
        publisherDisplayName: 'Your Publisher Name',
        assets: './src/main/ressources/',
        makePri: 'true',
        publisher: 'Your Publisher DN',
        devCert: 'Your Dev Cert Path',
      },
    },
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'src/main/index.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
  ],
};

export default config;
