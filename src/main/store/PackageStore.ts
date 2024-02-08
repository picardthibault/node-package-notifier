import Store = require('electron-store');
import { generateKey } from '@main/helpers/KeyStoreHelper';
import { PackageDetails } from '@type/PackageInfo';

export interface PackageConfig {
  name: string;
  registryUrl: string;
  latest?: string;
}
export const isPackageConfig = (object: unknown): object is PackageConfig => {
  const objectAsPackageConfig = object as {
    name?: string;
    registryUrl?: string;
  };
  return (
    objectAsPackageConfig.name !== undefined &&
    objectAsPackageConfig.registryUrl !== undefined
  );
};

export type IPackageStore = Record<string, PackageConfig>;

export class PackageStore {
  private static instance: PackageStore | undefined;

  static get(): PackageStore {
    if (PackageStore.instance === undefined) {
      PackageStore.instance = new PackageStore();
    }
    return PackageStore.instance;
  }

  private store: Store<IPackageStore>;

  private constructor() {
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
    const packageKey = generateKey();
    this.store.set(
      packageKey,
      this.mapPackageDetailsToPackageConfig(packageDetails),
    );
    return packageKey;
  }

  updatePackage(packageKey: string, newPackageDetails: PackageDetails) {
    this.store.set(
      packageKey,
      this.mapPackageDetailsToPackageConfig(newPackageDetails),
    );
  }

  deletePackage(packageKey: string): void {
    this.store.delete(packageKey);
  }

  getPackage(packagekey: string): PackageConfig {
    return this.store.get(packagekey);
  }

  getPackages(): IPackageStore {
    return this.store.store;
  }
}
