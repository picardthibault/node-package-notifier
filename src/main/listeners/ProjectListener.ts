import { ipcMain } from 'electron';
import { ProjectListenerChannel } from '../../types/IpcChannel';
import log from 'electron-log';
import { validateProjectPath } from '../services/project/ProjectService';

ipcMain.on(
  ProjectListenerChannel.VALIDATE_PROJECT_PATH,
  (event, projectPath: string) => {
    log.info(`Validate projectPath "${projectPath}"`);

    const validationResult = validateProjectPath(projectPath);

    event.returnValue = validationResult;
  },
);
