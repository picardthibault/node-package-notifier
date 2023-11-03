import { ipcMain } from 'electron';
import { ProjectListenerChannel } from '../../types/IpcChannel';
import { ProjectImportArgs } from '../../types/ProjectListenerArgs';
import log from 'electron-log';
import {
  validateProjectPath,
  importProject,
  validateProjectName,
  getProjectsDataForMenu,
  parseProject,
  getProjectDetails,
  fetchLatestsVersions,
} from '../services/project/ProjectService';
import { mainWindow } from '..';

ipcMain.on(
  ProjectListenerChannel.VALIDATE_PROJECT_NAME,
  async (event, projectName: string) => {
    log.debug('Received projectName validation IPC');

    const validationResult = validateProjectName(projectName);

    if (mainWindow) {
      mainWindow.webContents.send(
        ProjectListenerChannel.VALIDATE_PROJECT_NAME_LISTENER,
        validationResult,
      );
    }
  },
);

ipcMain.on(
  ProjectListenerChannel.VALIDATE_PROJECT_PATH,
  async (event, projectPath: string) => {
    log.debug('Received projectPath validation IPC');

    const validationResult = await validateProjectPath(projectPath);

    if (mainWindow) {
      mainWindow.webContents.send(
        ProjectListenerChannel.VALIDATE_PROJECT_PATH_LISTENER,
        validationResult,
      );
    }
  },
);

ipcMain.on(
  ProjectListenerChannel.IMPORT_PROJECT,
  async (event, projectImportArgs: ProjectImportArgs) => {
    log.debug('Received project import validation IPC');

    let projectKey: string | undefined;
    let importError: string | undefined;
    try {
      projectKey = await importProject(
        projectImportArgs.name,
        projectImportArgs.path,
      );
    } catch (err) {
      log.error(`Unable to import project. ${err.message}`);
      importError = err.message;
    }

    if (mainWindow) {
      mainWindow.webContents.send(
        ProjectListenerChannel.IMPORT_PROJECT_LISTENER,
        {
          projectKey: projectKey,
          error: importError,
        },
      );
    }
  },
);

ipcMain.on(ProjectListenerChannel.GET_PROJECTS_DATA_FOR_MENU, () => {
  log.debug('Received get projects data for menu IPC');

  const projectsDataForMenu = getProjectsDataForMenu();
  if (mainWindow) {
    mainWindow.webContents.send(
      ProjectListenerChannel.GET_PROJECTS_DATA_FOR_MENU_LISTENER,
      projectsDataForMenu,
    );
  }
});

ipcMain.handle(
  ProjectListenerChannel.GET_PROJECT_DETAILS,
  (event, projectKey: string) => {
    log.debug(
      `Received get project details IPC with projectKey "${projectKey}"`,
    );
    return getProjectDetails(projectKey);
  },
);

ipcMain.handle(
  ProjectListenerChannel.PARSE_PROJECT,
  async (event, projectKey: string) => {
    log.debug(`Received parse project IPC with projectKey "${projectKey}"`);
    return parseProject(projectKey);
  },
);

ipcMain.handle(
  ProjectListenerChannel.FETCH_LATEST_VERSIONS,
  async (event, projectDependencies: string[]) => {
    log.debug('Received fetch latest versions IPC');
    return fetchLatestsVersions(projectDependencies);
  },
);
