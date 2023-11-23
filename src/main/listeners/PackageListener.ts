import { ipcMain } from 'electron';
import { PackageListenerChannel } from '../../types/IpcChannel';
import {
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
  getPackageTags,
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
      result[key] = await getPackage(packages[key]);
    }
    return result;
  },
);

ipcMain.on(PackageListenerChannel.GET, (event, packageId: string) => {
  log.debug('Received get package IPC');
  event.returnValue = PackageStore.get().getPackage(packageId);
});

ipcMain.on(
  PackageListenerChannel.FETCH_TAGS,
  async (event, packageId: string) => {
    if (mainWindow) {
      log.debug(`Received fetch tags of <${packageId}>`);

      const fetchTagsResult = await getPackageTags(packageId);

      mainWindow.webContents.send(
        PackageListenerChannel.FETCH_TAGS_LISTENER,
        fetchTagsResult,
      );
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
