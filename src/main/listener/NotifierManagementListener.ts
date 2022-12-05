import { ipcMain } from 'electron';
import { NotifierManagementChannel } from '../../types/IpcChannel';
import { NotifierCreationArgs } from '../../types/NotifierManagement';

ipcMain.on(
  NotifierManagementChannel.CREATE,
  (event, creationArgs: NotifierCreationArgs) => {
    console.log(creationArgs);
  },
);
