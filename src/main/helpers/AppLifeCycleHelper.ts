import { app, BrowserWindow } from 'electron';
import log from 'electron-log';
import * as path from 'path';

export function createMainWindow(
  preloadEntry: string,
  mainWindowEntry: string,
): BrowserWindow {
  log.info('Create main Window');
  const mainWindow = new BrowserWindow({
    title: 'Node Package Notifier',
    height: 1050,
    minHeight: 530,
    width: 1650,
    minWidth: 900,
    icon: path.join(__dirname, 'ressources', 'logo.png'),
    webPreferences: {
      preload: preloadEntry,
    },
  });

  if (app.isPackaged) {
    mainWindow.removeMenu();
  }
  void mainWindow.loadURL(mainWindowEntry);

  return mainWindow;
}
