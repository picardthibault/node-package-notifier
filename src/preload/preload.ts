import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  NotifierCreationArgs,
  NotifierUpdateArgs,
} from '../types/NotifierManagement';
import { NotifierManagementChannel } from '../types/IpcChannel';
import { NotifierConfig } from '../main/store/NotifierStore';

contextBridge.exposeInMainWorld('notifierManagement', {
  create: (creationArgs: NotifierCreationArgs) =>
    ipcRenderer.send(NotifierManagementChannel.CREATE, creationArgs),
  update: (updateArgs: NotifierUpdateArgs) =>
    ipcRenderer.send(NotifierManagementChannel.UPDATE, updateArgs),
  getAll: () => ipcRenderer.send(NotifierManagementChannel.GET_ALL),
  getAllListener: (
    listener: (
      event: IpcRendererEvent,
      args: { [key: string]: NotifierConfig },
    ) => void,
  ) => {
    ipcRenderer.on(NotifierManagementChannel.GET_ALL_LISTENER, listener);
    return () =>
      ipcRenderer.removeListener(
        NotifierManagementChannel.GET_ALL_LISTENER,
        listener,
      );
  },
  get: (notifierId: string): { name: string } =>
    ipcRenderer.sendSync(NotifierManagementChannel.GET, notifierId),
});
