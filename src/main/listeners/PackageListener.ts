import { ipcMain } from 'electron';
import { PackageListenerChannel } from '../../types/IpcChannel';
import {
  GetPackageResult,
  GetPackagesResult,
  PackageCreationArgs,
  PackageDetails,
  PackageSuggestionArgs,
} from '../../types/PackageListenerArgs';
import { PackageStore } from '../store/PackageStore';
import { mainWindow } from '../index';
import log from 'electron-log';
import {
  createPackage,
  deletePackage,
  fetchPackageSuggestions,
  getPackage,
} from '../services/package/PackageService';

ipcMain.handle(
  PackageListenerChannel.CREATE,
  async (
    event,
    creationArgs: PackageCreationArgs,
  ): Promise<string | undefined> => {
    log.debug('Received create package IPC');
    return createPackage(creationArgs.packageName, creationArgs.registryUrl);
  },
);

ipcMain.handle(
  PackageListenerChannel.DELETE,
  (event, packageId: string): Promise<void> => {
    log.debug('Received delete package IPC');
    return Promise.resolve(deletePackage(packageId));
  },
);

ipcMain.handle(
  PackageListenerChannel.GET_PACKAGES,
  async (): Promise<GetPackagesResult> => {
    log.debug('Received get packages IPC');
    const packages = PackageStore.get().getPackages();
    const result: { [key: string]: PackageDetails } = {};
    for (const key of Object.keys(packages)) {
      const packageDetails = await getPackage(packages[key]);
      if (typeof packageDetails === 'string') {
        log.warn(
          `Unable to fetch package "${packages[key].name}" details. Received error : ${packageDetails}`,
        );
        result[key] = { ...packages[key] };
      } else {
        result[key] = packageDetails;
      }
    }
    return result;
  },
);

ipcMain.handle(
  PackageListenerChannel.GET_PACKAGE,
  async (event, packageId: string): Promise<GetPackageResult> => {
    log.debug('Received get package IPC');
    const packageConfig = PackageStore.get().getPackage(packageId);
    const packageDetails = await getPackage(packageConfig);
    if (typeof packageDetails === 'string') {
      return {
        error: packageDetails,
        packageDetails: {
          ...packageConfig,
        },
      };
    } else {
      return {
        packageDetails: packageDetails,
      };
    }
  },
);

ipcMain.on(
  PackageListenerChannel.GET_SUGGESTIONS,
  async (event, suggestionArgs: PackageSuggestionArgs) => {
    if (mainWindow) {
      log.debug('Received get package suggestions');

      const suggestions = await fetchPackageSuggestions(suggestionArgs);

      mainWindow.webContents.send(
        PackageListenerChannel.GET_SUGGESTIONS_LISTENER,
        suggestions,
      );
    }
  },
);
