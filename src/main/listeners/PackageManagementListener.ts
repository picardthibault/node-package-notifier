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
    await PackageStore.get().addPackage({
      name: creationArgs.packageName,
    });
  },
);

ipcMain.on(
  PackageManagementChannel.UPDATE,
  async (event, updateArgs: PackageUpdateArgs) => {
    await PackageStore.get().updatePackage(updateArgs.packageId, {
      name: updateArgs.packageName,
    });
  },
);

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
