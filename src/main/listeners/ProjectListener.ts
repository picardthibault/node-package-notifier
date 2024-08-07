import { dialog, ipcMain } from 'electron';
import { ProjectListenerChannel } from '@type/IpcChannel';
import {
  FetchLatestVersionArgs,
  FetchPublicationDateArgs,
  GetProjectDetailsResult,
  ProjectCreationArgs,
  ProjectCreationResult,
} from '@type/ProjectListenerArgs';
import log from 'electron-log';
import {
  validateProjectPath,
  createProject,
  getProjectsSumUp,
  getProjectDetails,
  isProjectNameUsed,
  fetchLatestVersion,
  deleteProject,
  fetchVersionTime,
} from '@main/services/project/ProjectService';
import { ProjectSumUp } from '@type/ProjectInfo';
import { getErrorMessage } from '@main/services/error/ErrorService';

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
  (): Promise<ProjectSumUp[]> => {
    log.debug('Received get projects data for menu IPC');

    const projectSumUp = getProjectsSumUp();
    return Promise.resolve(projectSumUp);
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
