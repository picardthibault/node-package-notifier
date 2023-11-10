import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  PackageCreationArgs,
  PackageSuggestionArgs,
} from '../types/PackageListenerArgs';
import {
  PackageListenerChannel,
  ProjectListenerChannel,
} from '../types/IpcChannel';
import { PackageConfig } from '../main/store/PackageStore';
import { PackageData, Tags } from '../types/PackageInfo';
import {
  ProjectDataForMenu,
  ProjectImportArgs,
  ProjectImportResult,
  ProjectDetails,
  ParsedProject,
} from '../types/ProjectListenerArgs';

contextBridge.exposeInMainWorld('packageManagement', {
  create: (creationArgs: PackageCreationArgs) =>
    ipcRenderer.send(PackageListenerChannel.CREATE, creationArgs),
  createListener: (
    listener: (
      event: IpcRendererEvent,
      errorMessage: string | undefined,
    ) => void,
  ) => {
    ipcRenderer.on(PackageListenerChannel.CREATE_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageListenerChannel.CREATE_LISTENER,
        listener,
      );
  },
  delete: (packageId: string) =>
    ipcRenderer.send(PackageListenerChannel.DELETE, packageId),
  deleteListener: (listener: () => void) => {
    ipcRenderer.on(PackageListenerChannel.DELETE_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageListenerChannel.DELETE_LISTENER,
        listener,
      );
  },
  getAll: () => ipcRenderer.send(PackageListenerChannel.GET_ALL),
  getAllListener: (
    listener: (
      event: IpcRendererEvent,
      args: { [key: string]: PackageConfig },
    ) => void,
  ) => {
    ipcRenderer.on(PackageListenerChannel.GET_ALL_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageListenerChannel.GET_ALL_LISTENER,
        listener,
      );
  },
  get: (packageId: string): PackageData =>
    ipcRenderer.sendSync(PackageListenerChannel.GET, packageId),
  fetchTags: (packageId: string) =>
    ipcRenderer.send(PackageListenerChannel.FETCH_TAGS, packageId),
  fetchTagsListener: (
    listener: (
      event: IpcRendererEvent,
      fetchResult: Tags | string | undefined,
    ) => void,
  ) => {
    ipcRenderer.on(PackageListenerChannel.FETCH_TAGS_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageListenerChannel.FETCH_TAGS_LISTENER,
        listener,
      );
  },
  getSuggestions: (suggestionArgs: PackageSuggestionArgs) =>
    ipcRenderer.send(PackageListenerChannel.GET_SUGGESTIONS, suggestionArgs),
  getSuggestionsListener: (
    listener: (event: IpcRendererEvent, suggestions: string[] | string) => void,
  ) => {
    ipcRenderer.on(PackageListenerChannel.GET_SUGGESTIONS_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageListenerChannel.GET_SUGGESTIONS_LISTENER,
        listener,
      );
  },
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
