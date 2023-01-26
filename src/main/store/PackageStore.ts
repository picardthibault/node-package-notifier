import Store = require('electron-store');
import { getSha1 } from '../helpers/HashHelper';
import {
  getPackageInfo,
  PackageInfo,
} from '../services/package/PackageService';

export interface PackageConfig {
  name: string;
  latest?: string;
  license?: string;
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

  private async createPackage(newPackage: PackageConfig): Promise<void> {
    let packageInfo: PackageInfo | undefined;
    try {
      packageInfo = await getPackageInfo(newPackage.name);
    } catch (err) {
      console.error(`Error while fetching ${newPackage.name} informations`);
    }
    const packageKey = getSha1(newPackage.name);
    this.store.set(packageKey, {
      ...newPackage,
      latest: packageInfo.latest,
      license: packageInfo.license,
    });
  }

  async addPackage(newPackage: PackageConfig): Promise<void> {
    await this.createPackage(newPackage);
  }

  async updatePackage(
    packageId: string,
    newPackage: PackageConfig,
  ): Promise<void> {
    this.store.delete(packageId);
    await this.createPackage(newPackage);
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
