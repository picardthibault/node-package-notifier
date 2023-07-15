import { PackageCreationArgs, PackageUpdateArgs } from './PackageManagement';
import { IpcRendererEvent } from 'electron';
import { PackageConfig } from '../main/store/PackageStore';
import { PackageData } from './PackageInfo';

export {};

declare global {
  interface Window {
    packageManagement: {
      create: (creationArgs: PackageCreationArgs) => void;
      createListener: (
        listener: (event: IpcRendererEvent, errorMessage: string | undefined) => void,
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
    };
  }
}
