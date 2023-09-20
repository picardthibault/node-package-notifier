import { PackageCreationArgs, PackageUpdateArgs } from './PackageListenerArgs';
import { IpcRendererEvent } from 'electron';
import { PackageConfig } from '../main/store/PackageStore';
import { PackageData } from './PackageInfo';
import { ProjectPathValidationResult } from './ProjectInfo';

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
      validateProjectPath: (projectPath: string) => void;
      validateProjectPathListener: (
        listener: (
          event: IpcRendererEvent,
          validationResult: ProjectPathValidationResult,
        ) => void,
      ) => () => void;
    };
  }
}
