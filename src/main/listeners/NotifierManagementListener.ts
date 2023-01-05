import { ipcMain } from 'electron';
import { NotifierManagementChannel } from '../../types/IpcChannel';
import {
  NotifierCreationArgs,
  NotifierUpdateArgs,
} from '../../types/NotifierManagement';
import { NotifierStore } from '../store/NotifierStore';
import { mainWindow } from '../index';

ipcMain.on(
  NotifierManagementChannel.CREATE,
  (event, creationArgs: NotifierCreationArgs) => {
    NotifierStore.get().addNotifier({
      name: creationArgs.packageName,
    });
  },
);

ipcMain.on(
  NotifierManagementChannel.UPDATE,
  (event, updateArgs: NotifierUpdateArgs) => {
    NotifierStore.get().updateNotifier(updateArgs.notifierId, {
      name: updateArgs.packageName,
    });
  },
);

ipcMain.on(NotifierManagementChannel.GET_ALL, () => {
  if (mainWindow) {
    mainWindow.webContents.send(
      NotifierManagementChannel.GET_ALL_LISTENER,
      NotifierStore.get().getNotifiers(),
    );
  }
});

ipcMain.on(NotifierManagementChannel.GET, (event, notifierId: string) => {
  event.returnValue = NotifierStore.get().getNotifier(notifierId);
});
