import { ipcMain } from 'electron';
import { PackageListenerChannel } from '../../types/IpcChannel';
import {
  PackageCreationArgs,
  PackageSuggestionArgs,
  PackageUpdateArgs,
} from '../../types/PackageListenerArgs';
import { PackageStore } from '../store/PackageStore';
import { mainWindow } from '../index';
import log from 'electron-log';
import {
  getPackageSuggestions,
  getPackageTags,
} from '../services/package/PackageService';

ipcMain.on(
  PackageListenerChannel.CREATE,
  async (event, creationArgs: PackageCreationArgs) => {
    log.debug('Received create package IPC');
    const errorMessage = await PackageStore.get().addPackage(
      creationArgs.packageName,
      creationArgs.registryUrl,
    );
    if (mainWindow) {
      mainWindow.webContents.send(
        PackageListenerChannel.CREATE_LISTENER,
        errorMessage,
      );
    }
  },
);

ipcMain.on(
  PackageListenerChannel.UPDATE,
  async (event, updateArgs: PackageUpdateArgs) => {
    log.debug('Received update package IPC');
    const isUpdated = await PackageStore.get().updatePackage(
      updateArgs.packageId,
      updateArgs.packageName,
      'https://registry.npmjs.org',
    );
    if (mainWindow) {
      mainWindow.webContents.send(
        PackageListenerChannel.UPDATE_LISTENER,
        isUpdated,
      );
    }
  },
);

ipcMain.on(PackageListenerChannel.DELETE, (event, packageId: string) => {
  log.debug('Received delete package IPC');
  PackageStore.get().deletePackage(packageId);
  if (mainWindow) {
    mainWindow.webContents.send(PackageListenerChannel.DELETE_LISTENER);
  }
});

ipcMain.on(PackageListenerChannel.GET_ALL, () => {
  if (mainWindow) {
    log.debug('Received get all package IPC');
    mainWindow.webContents.send(
      PackageListenerChannel.GET_ALL_LISTENER,
      PackageStore.get().getPackages(),
    );
  }
});

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

      const suggestions = await getPackageSuggestions(suggestionArgs);

      mainWindow.webContents.send(
        PackageListenerChannel.GET_SUGGESTIONS_LISTENER,
        suggestions,
      );
    }
  },
);
