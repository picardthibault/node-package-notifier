import { ipcMain } from 'electron';
import { PackageManagementChannel } from '../../types/IpcChannel';
import {
  PackageCreationArgs,
  PackageUpdateArgs,
} from '../../types/PackageManagement';
import { PackageStore } from '../store/PackageStore';
import { mainWindow } from '../index';
import log from 'electron-log';

ipcMain.on(
  PackageManagementChannel.CREATE,
  async (event, creationArgs: PackageCreationArgs) => {
    log.debug('Received create package IPC');
    const isAdded = await PackageStore.get().addPackage(
      creationArgs.packageName,
      creationArgs.registryUrl,
    );
    if (mainWindow) {
      mainWindow.webContents.send(
        PackageManagementChannel.CREATE_LISTENER,
        isAdded,
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
