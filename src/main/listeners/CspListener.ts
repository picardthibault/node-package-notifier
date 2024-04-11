import { cspNonce } from '@main/helpers/CspHelper';
import { CspChannel } from '@type/IpcChannel';
import { ipcMain } from 'electron';
import log from 'electron-log';

ipcMain.on(CspChannel.GET_CSP_NONCE, (event) => {
  log.debug('Received get csp nonce IPC');
  event.returnValue = cspNonce;
});
