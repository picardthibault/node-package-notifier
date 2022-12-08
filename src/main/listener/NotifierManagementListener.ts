import { ipcMain } from 'electron';
import { NotifierManagementChannel } from '../../types/IpcChannel';
import { NotifierCreationArgs } from '../../types/NotifierManagement';
import { ListenerStore } from '../Store/ListenerStore';

ipcMain.on(
  NotifierManagementChannel.CREATE,
  (event, creationArgs: NotifierCreationArgs) => {
    ListenerStore.get().addListener({
      name: creationArgs.packageName,
    });
  },
);
