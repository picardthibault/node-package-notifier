import { BrowserWindow } from 'electron';

export function createMainWindow(
  preloadEntry: string,
  mainWindowEntry: string,
): BrowserWindow {
  console.log('Create main Window');
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: preloadEntry,
    },
  });

  mainWindow.loadURL(mainWindowEntry);

  return mainWindow;
}
