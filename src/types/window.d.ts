import { IpcRendererEvent } from 'electron';
import {
  PackageCreationArgs,
  GetPackagesResult,
  GetPackageResult,
} from './PackageListenerArgs.js';
import {
  ProjectCreationArgs,
  ProjectCreationResult,
  GetProjectDetailsResult,
  FetchLatestVersionArgs,
  FetchPublicationDateArgs,
  ExportDependenciesWithNewVersionArgs,
} from './ProjectListenerArgs.js';
import { ProjectListElement } from './ProjectInfo.js';

export {};

declare global {
  interface Window {
    fileManagement: {
      getPathFromFile: (file: File) => string;
    };
    packageManagement: {
      create: (
        creationArgs: PackageCreationArgs,
      ) => Promise<string | undefined>;
      delete: (packageKey: string) => Promise<void>;
      getPackages: () => Promise<GetPackagesResult>;
      getPackage: (
        packageName: string,
        registryUrl: string,
      ) => Promise<GetPackageResult>;
      getSuggestions: (
        suggestionArgs: PackageSuggestionArgs,
      ) => Promise<string[] | string>;
      openPackageHomePage: (packageHomePage: string) => Promise<void>;
      getSuggestionsListener: (
        listener: (
          event: IpcRendererEvent,
          suggestions: string[] | string,
        ) => void,
      ) => () => void;
    };
    projectManagement: {
      projectPathSelector: (defaultPath: string) => Promise<string | undefined>;
      isProjectNameUsed: (projectName: string) => Promise<boolean>;
      isProjectPathValid: (projectPath: string) => Promise<string | undefined>;
      create: (
        projectCreationArgs: ProjectCreationArgs,
      ) => Promise<ProjectCreationResult>;
      delete: (projectKey: string) => Promise<void>;
      getProjectList: () => Promise<ProjectListElement[]>;
      getProjectDetails: (
        projectKey: string,
      ) => Promise<GetProjectDetailsResult>;
      fetchLatestVersion: (
        fetchLatestVersionArgs: FetchLatestVersionArgs,
      ) => Promise<string | undefined>;
      fetchPublicationDate: (
        fetchPublicationDateArgs: FetchPublicationDateArgs,
      ) => Promise<string | undefined>;
      exportDependenciesWithNewVersionSaveDialog: () => Promise<
        string | undefined
      >;
      exportDependenciesWithNewVersion: (
        exportDependenciesWithNewVersionArgs: ExportDependenciesWithNewVersionArgs,
      ) => Promise<string | undefined>;
    };
  }
}
