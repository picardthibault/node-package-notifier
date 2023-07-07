import log from 'electron-log';
import Store = require('electron-store');
import { getSha1 } from '../helpers/HashHelper';
import { getPackageInfo } from '../services/package/PackageService';

export interface PackageConfig {
  name: string;
  registryUrl: string;
  license?: string;
  homePage?: string;
  repository?: string;
  description?: string;
  latest?: string;
  tags?: { [key: string]: string };
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

  private async createPackage(
    packageName: string,
    registryUrl: string,
  ): Promise<{ key: string; package: PackageConfig } | undefined> {
    const packageInfo = await getPackageInfo(packageName);
    if (packageInfo === undefined) {
      log.error(`Error while fetching "${packageName}" informations`);
      return undefined;
    }
    const packageKey = getSha1(packageName);
    this.store.set(packageKey, {
      name: packageName,
      registryUrl,
      license: packageInfo.license,
      homePage: packageInfo.homePage,
      repository: packageInfo.repository,
      description: packageInfo.description,
      latest: packageInfo.latest,
      tags: packageInfo.tags,
    });
    return {
      key: packageKey,
      package: this.store.get(packageKey),
    };
  }

  async addPackage(packageName: string, registryUrl: string): Promise<boolean> {
    const packageKey = await this.createPackage(packageName, registryUrl);
    return packageKey !== undefined;
  }

  async updatePackage(
    packageId: string,
    packageName: string,
    registryUrl: string,
  ): Promise<PackageConfig | undefined> {
    const updateResult = await this.createPackage(packageName, registryUrl);
    if (updateResult !== undefined && updateResult.key !== packageId) {
      this.store.delete(packageId);
    }
    return updateResult?.package;
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
