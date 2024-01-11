import { contextBridge, ipcRenderer } from 'electron';
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
  ProjectCreationArgs,
  ProjectCreationResult,
  GetProjectDetailsResult,
  FetchLatestVersionArgs,
} from '../types/ProjectListenerArgs';
import { ProjectSumUp } from '../types/ProjectInfo';

contextBridge.exposeInMainWorld('packageManagement', {
  create: (creationArgs: PackageCreationArgs): Promise<string | undefined> =>
    ipcRenderer.invoke(PackageListenerChannel.CREATE, creationArgs),
  delete: (packageName: string) =>
    ipcRenderer.invoke(PackageListenerChannel.DELETE, packageName),
  getPackages: (): Promise<GetPackagesResult> =>
    ipcRenderer.invoke(PackageListenerChannel.GET_PACKAGES),
  getPackage: (
    packageName: string,
    registryUrl: string,
  ): Promise<GetPackageResult> =>
    ipcRenderer.invoke(PackageListenerChannel.GET_PACKAGE, {
      packageName: packageName,
      registryUrl: registryUrl,
    }),
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
  delete: (projectKey: string) =>
    ipcRenderer.invoke(ProjectListenerChannel.DELETE, projectKey),
  getProjectsSumUp: (): Promise<ProjectSumUp[]> =>
    ipcRenderer.invoke(ProjectListenerChannel.GET_PROJECTS_SUM_UP),
  getProjectDetails: (projectKey: string): Promise<GetProjectDetailsResult> =>
    ipcRenderer.invoke(ProjectListenerChannel.GET_PROJECT_DETAILS, projectKey),
  fetchLatestVersion: (
    fetchLatestVersionArgs: FetchLatestVersionArgs,
  ): Promise<string | undefined> =>
    ipcRenderer.invoke(
      ProjectListenerChannel.FETCH_LATEST_VERSION,
      fetchLatestVersionArgs,
    ),
});
