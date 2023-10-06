import { PackageCreationArgs, PackageUpdateArgs } from './PackageListenerArgs';
import { IpcRendererEvent } from 'electron';
import { PackageConfig } from '../main/store/PackageStore';
import { PackageData } from './PackageInfo';
import {
  ProjectDataForMenu,
  ProjectImportArgs,
  ProjectImportResult,
} from './ProjectListenerArgs';

export {};

declare global {
  interface Window {
    packageManagement: {
      create: (creationArgs: PackageCreationArgs) => void;
      createListener: (
        listener: (
          event: IpcRendererEvent,
          errorMessage: string | undefined,
        ) => void,
      ) => void;
      update: (updateArgs: PackageUpdateArgs) => void;
      updateListener: (
        listener: (event: IpcRendererEvent, isUpdated: boolean) => void,
      ) => void;
      delete: (packageId: string) => void;
      deleteListener: (listener: () => void) => () => void;
      getAll: () => void;
      getAllListener: (
        listener: (
          event: IpcRendererEvent,
          packages: { [key: string]: PackageConfig },
        ) => void,
      ) => () => void;
      get: (packageId: string) => PackageData;
      fetchTags: (packageId: string) => void;
      fetchTagsListener: (
        listener: (
          event: IpcRendererEvent,
          fetchResult: Tags | string | undefined,
        ) => void,
      ) => () => void;
      getSuggestions: (suggestionArgs: PackageSuggestionArgs) => void;
      getSuggestionsListener: (
        listener: (
          event: IpcRendererEvent,
          suggestions: string[] | string,
        ) => void,
      ) => () => void;
    };
    projectManagement: {
      validateProjectName: (projectName: string) => void;
      validateProjectNameListener: (
        listener: (
          event: IpcRendererEvent,
          validationResult: string | undefined,
        ) => void,
      ) => () => void;
      validateProjectPath: (projectPath: string) => void;
      validateProjectPathListener: (
        listener: (
          event: IpcRendererEvent,
          validationResult: string | undefined,
        ) => void,
      ) => () => void;
      projectImport: (projectImportArgs: ProjectImportArgs) => void;
      projectImportListener: (
        listener: (
          event: IpcRendererEvent,
          importResult: ProjectImportResult,
        ) => void,
      ) => () => void;
      getProjectsDataForMenu: () => void;
      getProjectsDataForMenuListener: (
        listener: (event: IpcRendererEvent, keys: ProjectDataForMenu[]) => void,
      ) => () => void;
    };
  }
}
