import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  GetPackagesResult,
  PackageCreationArgs,
  GetPackageResult,
  PackageSuggestionArgs,
} from '../types/PackageListenerArgs';
import {
  PackageListenerChannel,
  ProjectListenerChannel,
} from '../types/IpcChannel';
import {
  ProjectDataForMenu,
  ProjectImportArgs,
  ProjectImportResult,
  ProjectDetails,
  ParsedProject,
} from '../types/ProjectListenerArgs';

contextBridge.exposeInMainWorld('packageManagement', {
  create: (creationArgs: PackageCreationArgs): Promise<string | undefined> =>
    ipcRenderer.invoke(PackageListenerChannel.CREATE, creationArgs),
  delete: (packageId: string) =>
    ipcRenderer.invoke(PackageListenerChannel.DELETE, packageId),
  getPackages: (): Promise<GetPackagesResult> =>
    ipcRenderer.invoke(PackageListenerChannel.GET_PACKAGES),
  getPackage: (packageId: string): Promise<GetPackageResult> =>
    ipcRenderer.invoke(PackageListenerChannel.GET_PACKAGE, packageId),
  getSuggestions: (
    suggestionArgs: PackageSuggestionArgs,
  ): Promise<string[] | string> =>
    ipcRenderer.invoke(PackageListenerChannel.GET_SUGGESTIONS, suggestionArgs),
});

contextBridge.exposeInMainWorld('projectManagement', {
  validateProjectName: (projectName: string) =>
    ipcRenderer.send(ProjectListenerChannel.VALIDATE_PROJECT_NAME, projectName),
  validateProjectNameListener: (
    listener: (
      event: IpcRendererEvent,
      validationResult: string | undefined,
    ) => void,
  ) => {
    ipcRenderer.on(
      ProjectListenerChannel.VALIDATE_PROJECT_NAME_LISTENER,
      listener,
    );
    return () =>
      ipcRenderer.removeListener(
        ProjectListenerChannel.VALIDATE_PROJECT_NAME_LISTENER,
        listener,
      );
  },
  validateProjectPath: (projectPath: string) =>
    ipcRenderer.send(ProjectListenerChannel.VALIDATE_PROJECT_PATH, projectPath),
  validateProjectPathListener: (
    listener: (
      event: IpcRendererEvent,
      validationResult: string | undefined,
    ) => void,
  ) => {
    ipcRenderer.on(
      ProjectListenerChannel.VALIDATE_PROJECT_PATH_LISTENER,
      listener,
    );
    return () =>
      ipcRenderer.removeListener(
        ProjectListenerChannel.VALIDATE_PROJECT_PATH_LISTENER,
        listener,
      );
  },
  projectImport: (projectImportArgs: ProjectImportArgs) =>
    ipcRenderer.send(ProjectListenerChannel.IMPORT_PROJECT, projectImportArgs),
  projectImportListener: (
    listener: (
      event: IpcRendererEvent,
      importResult: ProjectImportResult,
    ) => void,
  ) => {
    ipcRenderer.on(ProjectListenerChannel.IMPORT_PROJECT_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        ProjectListenerChannel.IMPORT_PROJECT_LISTENER,
        listener,
      );
  },
  getProjectsDataForMenu: () =>
    ipcRenderer.send(ProjectListenerChannel.GET_PROJECTS_DATA_FOR_MENU),
  getProjectsDataForMenuListener: (
    listener: (
      event: IpcRendererEvent,
      projectsData: ProjectDataForMenu[],
    ) => void,
  ) => {
    ipcRenderer.on(
      ProjectListenerChannel.GET_PROJECTS_DATA_FOR_MENU_LISTENER,
      listener,
    );
    return () =>
      ipcRenderer.removeListener(
        ProjectListenerChannel.GET_PROJECTS_DATA_FOR_MENU_LISTENER,
        listener,
      );
  },
  getProjectDetails: (projectKey: string): Promise<ProjectDetails> =>
    ipcRenderer.invoke(ProjectListenerChannel.GET_PROJECT_DETAILS, projectKey),
  parseProject: (projectKey: string): Promise<ParsedProject> =>
    ipcRenderer.invoke(ProjectListenerChannel.PARSE_PROJECT, projectKey),
  fetchLatestVersions: (projectDependencies: string[]) =>
    ipcRenderer.invoke(
      ProjectListenerChannel.FETCH_LATEST_VERSIONS,
      projectDependencies,
    ),
});
