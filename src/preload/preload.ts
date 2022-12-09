import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { NotifierCreationArgs } from '../types/NotifierManagement';
import { NotifierManagementChannel } from '../types/IpcChannel';
import { NotifierConfig } from '../main/Store/NotifierStore';

contextBridge.exposeInMainWorld('notifierManagement', {
  create: (creationArgs: NotifierCreationArgs) =>
    ipcRenderer.send(NotifierManagementChannel.CREATE, creationArgs),
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
});
