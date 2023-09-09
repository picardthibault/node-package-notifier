import { ipcMain } from 'electron';
import { ProjectListenerChannel } from '../../types/IpcChannel';

ipcMain.on(
  ProjectListenerChannel.VALIDATE_PROJECT_PATH,
  async (event, projectPath: string) => {
    // TODO : Made verification if the directory exist and if the directory contains a "package.json" file

    const validationResult = {
      isDirectory: true,
      hasPackageJson: true,
    };

    event.returnValue = validationResult;
  },
);
