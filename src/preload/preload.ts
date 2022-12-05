import { contextBridge, ipcRenderer } from 'electron';
import { NotifierCreationArgs } from '../types/NotifierManagement';
import { NotifierManagementChannel } from '../types/IpcChannel';

contextBridge.exposeInMainWorld('notifierManagement', {
  create: (creationArgs: NotifierCreationArgs) =>
    ipcRenderer.send(NotifierManagementChannel.CREATE, creationArgs),
});
