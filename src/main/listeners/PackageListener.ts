import { ipcMain } from 'electron';
import { PackageListenerChannel } from '../../types/IpcChannel';
import {
  GetPackageResult,
  GetPackagesResult,
  PackageCreationArgs,
  PackageDetailsArgs,
  PackageSuggestionArgs,
} from '../../types/PackageListenerArgs';
import { PackageDetails } from '../../types/PackageInfo';
import { PackageStore } from '../store/PackageStore';
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
    deletePackage(packageId);
    return Promise.resolve();
  },
);

ipcMain.handle(
  PackageListenerChannel.GET_PACKAGES,
  async (): Promise<GetPackagesResult> => {
    log.debug('Received get packages IPC');
    const packages = PackageStore.get().getPackages();
    const result: { [key: string]: PackageDetails } = {};
    for (const key of Object.keys(packages)) {
      const packageDetails = await getPackage(
        packages[key].registryUrl,
        packages[key].name,
      );
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
  async (event, detailsArgs: PackageDetailsArgs): Promise<GetPackageResult> => {
    log.debug('Received get package IPC');
    const packageDetails = await getPackage(
      detailsArgs.registryUrl,
      detailsArgs.packageName,
    );
    if (typeof packageDetails === 'string') {
      return {
        error: packageDetails,
        packageDetails: {
          name: detailsArgs.packageName,
          registryUrl: detailsArgs.registryUrl,
        },
      };
    } else {
      return {
        packageDetails: packageDetails,
      };
    }
  },
);

ipcMain.handle(
  PackageListenerChannel.GET_SUGGESTIONS,
  (
    event,
    suggestionArgs: PackageSuggestionArgs,
  ): Promise<string[] | string> => {
    log.debug('Received get package suggestions');
    return fetchPackageSuggestions(suggestionArgs);
  },
);
