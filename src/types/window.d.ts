import { IpcRendererEvent } from 'electron';
import {
  PackageCreationArgs,
  GetPackagesResult,
  GetPackageResult,
} from './PackageListenerArgs';
import {
  ProjectCreationArgs,
  ProjectCreationResult,
  GetProjectDetailsResult,
} from './ProjectListenerArgs';
import { ProjectSumUp } from './ProjectInfo';

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
      getProjectsSumUp: () => Promise<ProjectSumUp[]>;
      getProjectDetails: (
        projectKey: string,
      ) => Promise<GetProjectDetailsResult>;
      fetchLatestVersions: (
        projectDependencies: string[],
      ) => Promise<Map<string, string>>;
    };
  }
}
