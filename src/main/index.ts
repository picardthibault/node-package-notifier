import './listeners/index.js';
import '@main/helpers/LogConfiguration.js';
import { app, BrowserWindow, Menu, Tray } from 'electron';
import * as path from 'path';
import {
  createMainWindow,
  isDevEnv,
} from '@main/helpers/AppLifeCycleHelper.js';
import { launchUpdatePackageJob } from './jobs/PackageJobs.js';
import log from 'electron-log';
import i18n from './i18n.js';
import { appIcon } from './helpers/AppIconHelper.js';
import started from 'electron-squirrel-startup';

if (isDevEnv()) {
  app.setPath('userData', app.getPath('userData') + '-dev');
}

log.debug(`UserData path is "${app.getPath('userData')}"`);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

export let mainWindow: BrowserWindow | undefined;

export const ressourcePathFolder = path.join(import.meta.dirname, 'ressources');

const quitApp = (): void => {
  log.info('Exiting app');
  app.quit();
};

const reopenApp = (): void => {
  log.info('Reopen app');
  if (!mainWindow || mainWindow.isDestroyed()) {
    log.debug('Create a main window');
    mainWindow = createMainWindow();
  } else {
    log.debug('Push main window to front');
    mainWindow.show();
  }
};

const singleInstanceLock = app.requestSingleInstanceLock();
if (!singleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    reopenApp();
  });
}

app.on('ready', () => {
  log.info('Opening app');

  // Set Tray Icon
  const trayIcon = new Tray(appIcon);
  trayIcon.setToolTip(i18n.t('tray.tooltip'));
  trayIcon.addListener('click', reopenApp);

  // Create Tray menu
  const trayMenu = Menu.buildFromTemplate([
    {
      label: i18n.t('tray.open'),
      type: 'normal',
      click: reopenApp,
    },
    {
      label: i18n.t('tray.close'),
      type: 'normal',
      click: quitApp,
    },
  ]);
  trayIcon.setContextMenu(trayMenu);

  // Start Jobs
  launchUpdatePackageJob();
});

app.on('window-all-closed', () => {
  log.info('All window closed, staying in background...');
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createMainWindow();
  }
});

// Configure the app to automatically start at user login
app.setLoginItemSettings({
  openAtLogin: true,
});
