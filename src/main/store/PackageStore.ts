import Store = require('electron-store');
import { getSha1 } from '../helpers/HashHelper';
import { PackageDetails } from '../../types/PackageInfo';

export interface PackageConfig {
  name: string;
  registryUrl: string;
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

  mapPackageDetailsToPackageConfig(
    pacakgeDetails: PackageDetails,
  ): PackageConfig {
    return {
      name: pacakgeDetails.name,
      registryUrl: pacakgeDetails.registryUrl,
      latest: pacakgeDetails.latest,
    };
  }

  addPackage(packageDetails: PackageDetails): string {
    const packageKey = getSha1(packageDetails.name);
    this.store.set(
      packageKey,
      this.mapPackageDetailsToPackageConfig(packageDetails),
    );
    return packageKey;
  }

  updatePackage(
    previousKey: string,
    newPackageDetails: PackageDetails,
  ): string {
    const newPackageKey = getSha1(newPackageDetails.name);
    if (previousKey !== newPackageKey) {
      this.store.delete(previousKey);
    }
    this.store.set(
      newPackageKey,
      this.mapPackageDetailsToPackageConfig(newPackageDetails),
    );
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
