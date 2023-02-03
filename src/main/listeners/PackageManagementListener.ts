import { ipcMain } from 'electron';
import { PackageManagementChannel } from '../../types/IpcChannel';
import {
  PackageCreationArgs,
  PackageUpdateArgs,
} from '../../types/PackageManagement';
import { PackageStore } from '../store/PackageStore';
import { mainWindow } from '../index';

ipcMain.on(
  PackageManagementChannel.CREATE,
  async (event, creationArgs: PackageCreationArgs) => {
    const isAdded = await PackageStore.get().addPackage({
      name: creationArgs.packageName,
    });
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
    const isUpdated = await PackageStore.get().updatePackage(
      updateArgs.packageId,
      {
        name: updateArgs.packageName,
      },
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
  PackageStore.get().deletePackage(packageId);
  if (mainWindow) {
    mainWindow.webContents.send(PackageManagementChannel.DELETE_LISTENER);
  }
});

ipcMain.on(PackageManagementChannel.GET_ALL, () => {
  if (mainWindow) {
    mainWindow.webContents.send(
      PackageManagementChannel.GET_ALL_LISTENER,
      PackageStore.get().getPackages(),
    );
  }
});

ipcMain.on(PackageManagementChannel.GET, (event, packageId: string) => {
  event.returnValue = PackageStore.get().getPackage(packageId);
});
