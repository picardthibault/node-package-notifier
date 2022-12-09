import { NotifierCreationArgs } from './NotifierManagement';
import { IpcRendererEvent } from 'electron';
import { NotifierConfig } from '../main/Store/NotifierStore';

export {};

declare global {
  interface Window {
    notifierManagement: {
      create: (creationArgs: NotifierCreationArgs) => void;
      getAll: () => void;
      getAllListener: (
        listener: (
          event: IpcRendererEvent,
          notifiers: { [key: string]: NotifierConfig },
        ) => void,
      ) => () => void;
    };
  }
}
