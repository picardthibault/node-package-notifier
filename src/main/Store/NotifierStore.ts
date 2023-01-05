import Store = require('electron-store');
import { getSha1 } from '../helpers/HashHelper';

export interface NotifierConfig {
  name: string;
}

export type INotifierStore = {
  // key is the SHA1 of the notifier name
  [key: string]: NotifierConfig;
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

  addNotifier(newNotifier: NotifierConfig): void {
    const notifierKey = getSha1(newNotifier.name);
    this.store.set(notifierKey, newNotifier);
  }

  updateNotifier(notifierId: string, newNotifier: NotifierConfig): void {
    const newNotifierKey = getSha1(newNotifier.name);
    this.store.delete(notifierId);
    this.store.set(newNotifierKey, newNotifier);
  }

  getNotifier(key: string): NotifierConfig {
    return this.store.get(key);
  }

  getNotifiers(): { [key: string]: NotifierConfig } {
    return this.store.store;
  }
}
