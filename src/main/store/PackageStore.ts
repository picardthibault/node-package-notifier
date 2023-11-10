import Store = require('electron-store');
import { getSha1 } from '../helpers/HashHelper';

export interface PackageConfig {
  name: string;
  registryUrl: string;
  license?: string;
  homePage?: string;
  repository?: string;
  description?: string;
  latest?: string;
}
export const isPackageConfig = (object: unknown): object is PackageConfig => {
  const objectAsPackageConfig = object as PackageConfig;
  return (
    objectAsPackageConfig.name !== undefined &&
    objectAsPackageConfig.registryUrl !== undefined
  );
};

export type IPackageStore = {
  // key is the SHA1 of the package name
  [key: string]: PackageConfig;
};

export class PackageStore {
  private static instance: PackageStore | undefined;

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

  addPackage(packageConfig: PackageConfig): string {
    const packageKey = getSha1(packageConfig.name);
    this.store.set(packageKey, packageConfig);
    return packageKey;
  }

  updatePackage(previousKey: string, newPackageConfig: PackageConfig): string {
    const newPackageKey = getSha1(newPackageConfig.name);
    if (previousKey !== newPackageKey) {
      this.store.delete(previousKey);
    }
    this.store.set(newPackageKey, newPackageConfig);
    return newPackageKey;
  }

  deletePackage(packageId: string): void {
    this.store.delete(packageId);
  }

  getPackage(key: string): PackageConfig {
    return this.store.get(key);
  }

  getPackages(): { [key: string]: PackageConfig } {
    return this.store.store;
  }
}
