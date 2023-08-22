import { ipcMain } from 'electron';
import { PackageManagementChannel } from '../../types/IpcChannel';
import {
  PackageCreationArgs,
  PackageUpdateArgs,
} from '../../types/PackageManagement';
import { PackageStore } from '../store/PackageStore';
import { mainWindow } from '../index';
import log from 'electron-log';
import {
  getPackageSuggestions,
  getPackageTags,
} from '../services/package/PackageService';

ipcMain.on(
  PackageManagementChannel.CREATE,
  async (event, creationArgs: PackageCreationArgs) => {
    log.debug('Received create package IPC');
    const errorMessage = await PackageStore.get().addPackage(
      creationArgs.packageName,
      creationArgs.registryUrl,
    );
    if (mainWindow) {
      mainWindow.webContents.send(
        PackageManagementChannel.CREATE_LISTENER,
        errorMessage,
      );
    }
  },
);

ipcMain.on(
  PackageManagementChannel.UPDATE,
  async (event, updateArgs: PackageUpdateArgs) => {
    log.debug('Received update package IPC');
    const isUpdated = await PackageStore.get().updatePackage(
      updateArgs.packageId,
      updateArgs.packageName,
      'https://registry.npmjs.org',
    );
    if (mainWindow) {
      mainWindow.webContents.send(
        PackageManagementChannel.UPDATE_LISTENER,
        isUpdated,
      );
    }
  },
);

ipcMain.on(PackageManagementChannel.DELETE, (event, packageId: string) => {
  log.debug('Received delete package IPC');
  PackageStore.get().deletePackage(packageId);
  if (mainWindow) {
    mainWindow.webContents.send(PackageManagementChannel.DELETE_LISTENER);
  }
});

ipcMain.on(PackageManagementChannel.GET_ALL, () => {
  if (mainWindow) {
    log.debug('Received get all package IPC');
    mainWindow.webContents.send(
      PackageManagementChannel.GET_ALL_LISTENER,
      PackageStore.get().getPackages(),
    );
  }
});

ipcMain.on(PackageManagementChannel.GET, (event, packageId: string) => {
  log.debug('Received get package IPC');
  event.returnValue = PackageStore.get().getPackage(packageId);
});

ipcMain.on(
  PackageManagementChannel.FETCH_TAGS,
  async (event, packageId: string) => {
    if (mainWindow) {
      log.debug(`Received fetch tags of <${packageId}>`);

      const fetchTagsResult = await getPackageTags(packageId);

      mainWindow.webContents.send(
        PackageManagementChannel.FETCH_TAGS_LISTENER,
        fetchTagsResult,
      );
    }
  },
);

ipcMain.on(
  PackageManagementChannel.GET_SUGGESTIONS,
  async (event, current: string) => {
    if (mainWindow) {
      log.debug('Received get package suggestions');

      const suggestions = await getPackageSuggestions(current);

      mainWindow.webContents.send(
        PackageManagementChannel.GET_SUGGESTIONS_LISTENER,
        suggestions,
      );
    }
  },
);
