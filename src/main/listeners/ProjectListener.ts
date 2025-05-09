import { dialog, ipcMain } from 'electron';
import { ProjectListenerChannel } from '@type/IpcChannel.js';
import {
  ExportDependenciesWithNewVersionArgs,
  FetchLatestVersionArgs,
  FetchPublicationDateArgs,
  GetProjectDetailsResult,
  ProjectCreationArgs,
  ProjectCreationResult,
} from '@type/ProjectListenerArgs.js';
import log from 'electron-log';
import {
  validateProjectPath,
  createProject,
  getProjectList,
  getProjectDetails,
  isProjectNameUsed,
  fetchLatestVersion,
  deleteProject,
  fetchVersionTime,
} from '@main/services/project/ProjectService.js';
import { ProjectListElement } from '@type/ProjectInfo.js';
import { getErrorMessage } from '@main/services/error/ErrorService.js';
import { mainWindow } from '../index.js';
import { exportDependenciesWithNewVersion } from '@main/services/project/ExportService.js';

ipcMain.handle(
  ProjectListenerChannel.PROJECT_PATH_SELECTOR,
  async (event, defaultPath: string): Promise<string | undefined> => {
    log.debug('Received project path show selector IPC');
    const selection = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      defaultPath: defaultPath,
    });
    return selection.filePaths.length > 0 ? selection.filePaths[0] : undefined;
  },
);

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

ipcMain.handle(
  ProjectListenerChannel.CREATE,
  async (
    event,
    projectCreationArgs: ProjectCreationArgs,
  ): Promise<ProjectCreationResult> => {
    log.debug('Received create project IPC');

    let createdProjectKey = '';
    let importError: string | undefined;
    try {
      createdProjectKey = await createProject(
        projectCreationArgs.name,
        projectCreationArgs.path,
      );
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      log.error(`Unable to create project. ${errorMessage}`);
      importError = errorMessage;
    }

    return {
      projectKey: createdProjectKey,
      error: importError,
    };
  },
);

ipcMain.handle(
  ProjectListenerChannel.DELETE,
  (event, projectkey: string): Promise<void> => {
    log.debug('Received delete project IPC');
    deleteProject(projectkey);
    return Promise.resolve();
  },
);

ipcMain.handle(
  ProjectListenerChannel.GET_PROJECTS_SUM_UP,
  (): Promise<ProjectListElement[]> => {
    log.debug('Received get projects data for menu IPC');

    const projectList = getProjectList();
    return Promise.resolve(projectList);
  },
);

ipcMain.handle(
  ProjectListenerChannel.GET_PROJECT_DETAILS,
  (event, projectKey: string): Promise<GetProjectDetailsResult> => {
    log.debug(
      `Received get project details IPC with projectKey "${projectKey}"`,
    );
    return getProjectDetails(projectKey);
  },
);

ipcMain.handle(
  ProjectListenerChannel.FETCH_LATEST_VERSION,
  async (
    event,
    fetchLatestVersionArgs: FetchLatestVersionArgs,
  ): Promise<string | undefined> => {
    log.debug(
      `Received fetch latest version IPC with dependency "${fetchLatestVersionArgs.dependencyName}" and registry URL "${fetchLatestVersionArgs.registryUrl}`,
    );

    return fetchLatestVersion(
      fetchLatestVersionArgs.dependencyName,
      fetchLatestVersionArgs.registryUrl,
    );
  },
);

ipcMain.handle(
  ProjectListenerChannel.FETCH_PUBLICATION_DATE,
  async (
    event,
    fetchPublicationDateArgs: FetchPublicationDateArgs,
  ): Promise<string | undefined> => {
    log.debug(
      `Received fetch publication date IPC with dependency "${fetchPublicationDateArgs.dependencyName}, version "${fetchPublicationDateArgs.dependencyVersion} and registry URL "${fetchPublicationDateArgs.registryUrl}`,
    );

    return fetchVersionTime(
      fetchPublicationDateArgs.dependencyName,
      fetchPublicationDateArgs.dependencyVersion,
      fetchPublicationDateArgs.registryUrl,
    );
  },
);

ipcMain.handle(
  ProjectListenerChannel.EXPORT_DEPENDENCIES_WITH_NEW_VERSION_SAVE_DIALOG,
  async (): Promise<string | undefined> => {
    log.debug('Received export dependencies with new version save dialog IPC');
    return new Promise((resolve) => {
      if (mainWindow) {
        resolve(
          dialog.showSaveDialogSync(mainWindow, {
            filters: [{ name: 'text file', extensions: ['txt'] }],
          }),
        );
      } else {
        resolve(undefined);
      }
    });
  },
);

ipcMain.handle(
  ProjectListenerChannel.EXPORT_DEPENDENCIES_WITH_NEW_VERSION,
  async (
    event,
    exportDependenciesWithNewVersionArgs: ExportDependenciesWithNewVersionArgs,
  ): Promise<string | undefined> => {
    const { projectKey, outputFilePath } = exportDependenciesWithNewVersionArgs;
    log.debug(
      `Received export dependencies with new version IPC with projectKey "${projectKey} and outputFilePath "${outputFilePath}`,
    );
    await exportDependenciesWithNewVersion(projectKey, outputFilePath);
    return Promise.resolve(undefined);
  },
);
