import Store = require('electron-store');
import { getSha1 } from '../helper/hashHelper';

export interface ListenerConfig {
  name: string;
}

export interface IListenerStore {
  listeners: {
    // key is the SHA1 of the name
    [key: string]: ListenerConfig;
  };
}

export class ListenerStore {
  static instance: ListenerStore | undefined;

  static get(): ListenerStore {
    if (ListenerStore.instance === undefined) {
      ListenerStore.instance = new ListenerStore();
    }
    return ListenerStore.instance;
  }

  private store: Store<IListenerStore>;

  constructor() {
    // TODO : Find a solution to have a clean import
    this.store = new Store<IListenerStore>({
      // @ts-ignore
      configName: 'listener',
    });
  }

  addListener(newListener: ListenerConfig): void {
    const listenerKey = getSha1(newListener.name);
    this.store.set(`listeners.${listenerKey}`, newListener);
  }

  getListener(key: string): ListenerConfig {
    return this.store.get(`listeners.${key}`);
  }

  getListeners(): { [key: string]: ListenerConfig } {
    return this.store.get('listeners');
  }
}
