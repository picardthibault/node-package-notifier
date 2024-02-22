/* eslint-disable @typescript-eslint/no-unsafe-return */

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
  delete: (packageKey: string) =>
    ipcRenderer.invoke(PackageListenerChannel.DELETE, packageKey),
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
  openPackageHomePage: (packageHomePage: string): Promise<void> =>
    ipcRenderer.invoke(PackageListenerChannel.OPEN_HOME_PAGE, packageHomePage),
  getSuggestions: (
    suggestionArgs: PackageSuggestionArgs,
  ): Promise<string[] | string> =>
    ipcRenderer.invoke(PackageListenerChannel.GET_SUGGESTIONS, suggestionArgs),
});

contextBridge.exposeInMainWorld('projectManagement', {
  projectPathSelector: (defaultPath: string): Promise<string | undefined> =>
    ipcRenderer.invoke(
      ProjectListenerChannel.PROJECT_PATH_SELECTOR,
      defaultPath,
    ),
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
