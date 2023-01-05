import { BrowserWindow } from 'electron';
import * as path from 'path';

export function createMainWindow(
  preloadEntry: string,
  mainWindowEntry: string,
): BrowserWindow {
  console.log('Create main Window');
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    icon: path.join(__dirname, 'ressources', 'logo.png'),
    webPreferences: {
      preload: preloadEntry,
    },
  });

  mainWindow.loadURL(mainWindowEntry);

  return mainWindow;
}
