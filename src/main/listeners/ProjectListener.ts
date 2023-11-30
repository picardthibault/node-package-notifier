import { ipcMain } from 'electron';
import { ProjectListenerChannel } from '../../types/IpcChannel';
import { ProjectImportArgs } from '../../types/ProjectListenerArgs';
import log from 'electron-log';
import {
  validateProjectPath,
  importProject,
  getProjectsDataForMenu,
  parseProject,
  getProjectDetails,
  fetchLatestsVersions,
  isProjectNameUsed,
} from '../services/project/ProjectService';
import { mainWindow } from '..';

ipcMain.handle(
  ProjectListenerChannel.IS_PROJECT_NAME_USED,
  (event, projectName: string): Promise<boolean> => {
    log.debug('Received project name is already used IPC');
    return Promise.resolve(isProjectNameUsed(projectName));
  },
);

ipcMain.handle(
  ProjectListenerChannel.IS_PROJECT_PATH_VALID,
  (event, projectPath: string): Promise<string | undefined> => {
    log.debug('Received projectPath validation IPC');

    return validateProjectPath(projectPath);
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
