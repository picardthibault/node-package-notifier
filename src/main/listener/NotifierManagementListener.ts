import { ipcMain } from 'electron';
import { NotifierManagementChannel } from '../../types/IpcChannel';
import { NotifierCreationArgs } from '../../types/NotifierManagement';
import { NotifierStore } from '../Store/NotifierStore';
import { mainWindow } from '../index';

ipcMain.on(
  NotifierManagementChannel.CREATE,
  (event, creationArgs: NotifierCreationArgs) => {
    NotifierStore.get().addListener({
      name: creationArgs.packageName,
    });
  },
);

ipcMain.on(NotifierManagementChannel.GET_ALL, () => {
  if (mainWindow) {
    mainWindow.webContents.send(
      NotifierManagementChannel.GET_ALL_LISTENER,
      NotifierStore.get().getListeners(),
    );
  }
});

ipcMain.on(NotifierManagementChannel.GET, (event, notifierId: string) => {
  event.returnValue = NotifierStore.get().getListener(notifierId);
});
