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
  ProjectCreationArgs,
  ProjectCreationResult,
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
  isProjectNameUsed: (projectName: string): Promise<boolean> =>
    ipcRenderer.invoke(
      ProjectListenerChannel.IS_PROJECT_NAME_USED,
      projectName,
    ),
  isProjectPathValid: (projectPath: string): Promise<string | undefined> =>
    ipcRenderer.invoke(
      ProjectListenerChannel.IS_PROJECT_PATH_VALID,
      projectPath,
    ),
  create: (
    projectCreationArgs: ProjectCreationArgs,
  ): Promise<ProjectCreationResult> =>
    ipcRenderer.invoke(ProjectListenerChannel.CREATE, projectCreationArgs),
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
