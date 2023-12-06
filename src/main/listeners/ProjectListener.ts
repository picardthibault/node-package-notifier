import { ipcMain } from 'electron';
import { ProjectListenerChannel } from '../../types/IpcChannel';
import {
  ProjectCreationArgs,
  ProjectCreationResult,
} from '../../types/ProjectListenerArgs';
import log from 'electron-log';
import {
  validateProjectPath,
  createProject,
  getProjectsSumUp,
  parseProject,
  getProjectDetails,
  fetchLatestsVersions,
  isProjectNameUsed,
} from '../services/project/ProjectService';
import { ProjectSumUp } from '../../types/ProjectInfo';

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

    let createdProjectKey: string | undefined;
    let importError: string | undefined;
    try {
      createdProjectKey = await createProject(
        projectCreationArgs.name,
        projectCreationArgs.path,
      );
    } catch (err) {
      log.error(`Unable to create project. ${err.message}`);
      importError = err.message;
    }

    return {
      projectKey: createdProjectKey,
      error: importError,
    };
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
