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
}
export const isPackageConfig = (object: unknown): object is PackageConfig => {
  const objectAsPackageConfig = object as PackageConfig;
  return (
    objectAsPackageConfig.name !== undefined &&
    objectAsPackageConfig.registryUrl !== undefined
  );
};

export interface PackageCreationResult {
  key: string;
  package: PackageConfig;
}
export const isPackageCreationResult = (
  object: unknown,
): object is PackageCreationResult => {
  const objectAsPackageCreationResult = object as PackageCreationResult;
  return (
    objectAsPackageCreationResult.key !== undefined &&
    isPackageConfig(objectAsPackageCreationResult.package)
  );
};

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

  private readonly npmRegistryUrl = 'https://registry.npmjs.org';
  private store: Store<IPackageStore>;

  constructor() {
    this.store = new Store<IPackageStore>({
      name: 'packages',
    });
  }

  private async createPackage(
    packageName: string,
    registryUrl?: string,
  ): Promise<PackageCreationResult | string> {
    const adaptedRegistryUrl = registryUrl ? registryUrl : this.npmRegistryUrl;
    const packageInfo = await getPackageInfo(packageName, adaptedRegistryUrl);
    if (typeof packageInfo === 'string') {
      return packageInfo;
    }
    const packageKey = getSha1(packageName);
    this.store.set(packageKey, {
      name: packageName,
      registryUrl: adaptedRegistryUrl,
      license: packageInfo.license,
      homePage: packageInfo.homePage,
      repository: packageInfo.repository,
      description: packageInfo.description,
      latest: packageInfo.latest,
    });
    return {
      key: packageKey,
      package: this.store.get(packageKey),
    };
  }

  async addPackage(
    packageName: string,
    registryUrl?: string,
  ): Promise<string | undefined> {
    const creationResult = await this.createPackage(packageName, registryUrl);
    return isPackageCreationResult(creationResult) ? undefined : creationResult;
  }

  async updatePackage(
    packageId: string,
    packageName: string,
    registryUrl?: string,
  ): Promise<PackageConfig | string> {
    const updateResult = await this.createPackage(packageName, registryUrl);

    if (
      isPackageCreationResult(updateResult) &&
      updateResult.key !== packageId
    ) {
      this.store.delete(packageId);
    }

    return isPackageCreationResult(updateResult)
      ? updateResult.package
      : updateResult;
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
