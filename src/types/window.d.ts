import { NotifierCreationArgs, NotifierUpdateArgs } from './NotifierManagement';
import { IpcRendererEvent } from 'electron';
import { NotifierConfig } from '../main/store/NotifierStore';

export {};

declare global {
  interface Window {
    notifierManagement: {
      create: (creationArgs: NotifierCreationArgs) => void;
      update: (updateArgs: NotifierUpdateArgs) => void;
      getAll: () => void;
      getAllListener: (
        listener: (
          event: IpcRendererEvent,
          notifiers: { [key: string]: NotifierConfig },
        ) => void,
      ) => () => void;
      get: (notifierId: string) => { name: string };
    };
  }
}