import Store = require('electron-store');
import { getSha1 } from '../helpers/HashHelper';

export interface PackageConfig {
  name: string;
  latest?: string;
}

export type IPackageStore = {
  // key is the SHA1 of the package name
  [key: string]: PackageConfig;
};

export class PackageStore {
  static instance: PackageStore | undefined;

  static get(): PackageStore {
    if (PackageStore.instance === undefined) {
      PackageStore.instance = new PackageStore();
    }
    return PackageStore.instance;
  }

  private store: Store<IPackageStore>;

  constructor() {
    this.store = new Store<IPackageStore>({
      name: 'packages',
    });
  }

  addPackage(newPackage: PackageConfig): void {
    const packageKey = getSha1(newPackage.name);
    this.store.set(packageKey, newPackage);
  }

  updatePackage(packageId: string, newPackage: PackageConfig): void {
    const newPackageKey = getSha1(newPackage.name);
    this.store.delete(packageId);
    this.store.set(newPackageKey, newPackage);
  }

  getPackage(key: string): PackageConfig {
    return this.store.get(key);
  }

  getPackages(): { [key: string]: PackageConfig } {
    return this.store.store;
  }
}
