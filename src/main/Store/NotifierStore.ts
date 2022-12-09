import Store = require('electron-store');
import { getSha1 } from '../helper/hashHelper';

export interface NotifierConfig {
  name: string;
}

export type INotifierStore = {
  notifiers: {
    // key is the SHA1 of the notifier name
    [key: string]: NotifierConfig;
  };
};

export class NotifierStore {
  static instance: NotifierStore | undefined;

  static get(): NotifierStore {
    if (NotifierStore.instance === undefined) {
      NotifierStore.instance = new NotifierStore();
    }
    return NotifierStore.instance;
  }

  private store: Store<INotifierStore>;

  constructor() {
    this.store = new Store<INotifierStore>({
      name: 'notifiers',
    });
  }

  addListener(newListener: NotifierConfig): void {
    const listenerKey = getSha1(newListener.name);
    this.store.set(`notifiers.${listenerKey}`, newListener);
  }

  getListener(key: string): NotifierConfig {
    return this.store.get(`notifiers.${key}`);
  }

  getListeners(): { [key: string]: NotifierConfig } {
    return this.store.get('notifiers');
  }
}
