import { PackageCreationArgs, PackageUpdateArgs } from './PackageManagement';
import { IpcRendererEvent } from 'electron';
import { PackageConfig } from '../main/store/PackageStore';

export {};

declare global {
  interface Window {
    packageManagement: {
      create: (creationArgs: PackageCreationArgs) => void;
      update: (updateArgs: PackageUpdateArgs) => void;
      delete: (packageId: string) => void;
      deleteListener: (listener: () => void) => () => void;
      getAll: () => void;
      getAllListener: (
        listener: (
          event: IpcRendererEvent,
          packages: { [key: string]: PackageConfig },
        ) => void,
      ) => () => void;
      get: (packageId: string) => { name: string };
    };
  }
}
