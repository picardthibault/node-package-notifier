import { ipcMain } from 'electron';
import { ProjectListenerChannel } from '../../types/IpcChannel';
import log from 'electron-log';
import { validateProjectPath } from '../services/project/ProjectService';
import { mainWindow } from '..';

ipcMain.on(
  ProjectListenerChannel.VALIDATE_PROJECT_PATH,
  async (event, projectPath: string) => {
    log.info(`Validate projectPath "${projectPath}"`);

    const validationResult = await validateProjectPath(projectPath);

    if (mainWindow) {
      mainWindow.webContents.send(
        ProjectListenerChannel.VALIDATE_PROJECT_PATH_LISTENER,
        validationResult,
      );
    }
  },
);
