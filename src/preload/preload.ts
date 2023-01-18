import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  PackageCreationArgs,
  PackageUpdateArgs,
} from '../types/PackageManagement';
import { PackageManagementChannel } from '../types/IpcChannel';
import { PackageConfig } from '../main/store/PackageStore';

contextBridge.exposeInMainWorld('packageManagement', {
  create: (creationArgs: PackageCreationArgs) =>
    ipcRenderer.send(PackageManagementChannel.CREATE, creationArgs),
  update: (updateArgs: PackageUpdateArgs) =>
    ipcRenderer.send(PackageManagementChannel.UPDATE, updateArgs),
  getAll: () => ipcRenderer.send(PackageManagementChannel.GET_ALL),
  getAllListener: (
    listener: (
      event: IpcRendererEvent,
      args: { [key: string]: PackageConfig },
    ) => void,
  ) => {
    ipcRenderer.on(PackageManagementChannel.GET_ALL_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        PackageManagementChannel.GET_ALL_LISTENER,
        listener,
      );
  },
  get: (packageId: string): { name: string } =>
    ipcRenderer.sendSync(PackageManagementChannel.GET, packageId),
});
