import {
  PackageCreationArgs,
  GetPackagesResult,
  GetPackageResult,
} from './PackageListenerArgs';
import { IpcRendererEvent } from 'electron';
import {
  ProjectDataForMenu,
  ProjectCreationArgs,
  ProjectCreationResult,
  ProjectDetails,
  ParsedProject,
} from './ProjectListenerArgs';

export {};

declare global {
  interface Window {
    packageManagement: {
      create: (
        creationArgs: PackageCreationArgs,
      ) => Promise<string | undefined>;
      delete: (packageId: string) => Promise<void>;
      getPackages: () => Promise<GetPackagesResult>;
      getPackage: (packageId: string) => Promise<GetPackageResult>;
      getSuggestions: (
        suggestionArgs: PackageSuggestionArgs,
      ) => Promise<string[] | string>;
      getSuggestionsListener: (
        listener: (
          event: IpcRendererEvent,
          suggestions: string[] | string,
        ) => void,
      ) => () => void;
    };
    projectManagement: {
      isProjectNameUsed: (projectName: string) => Promise<boolean>;
      isProjectPathValid: (projectPath: string) => Promise<string | undefined>;
      create: (
        projectCreationArgs: ProjectCreationArgs,
      ) => Promise<ProjectCreationResult>;
      getProjectsDataForMenu: () => void;
      getProjectsDataForMenuListener: (
        listener: (event: IpcRendererEvent, keys: ProjectDataForMenu[]) => void,
      ) => () => void;
      getProjectDetails: (projectKey: string) => Promise<ProjectDetails>;
      parseProject: (projectKey: string) => Promise<ParsedProject>;
      fetchLatestVersions: (
        projectDependencies: string[],
      ) => Promise<Map<string, string>>;
    };
  }
}
