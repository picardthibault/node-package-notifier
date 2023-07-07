import log from 'electron-log';
import { PackageStore } from '../../store/PackageStore';
import { NpmRegistryApi } from '../api/NpmRegistryApi';

export interface PackageInfo {
  latest?: string;
  license?: string;
  homePage?: string;
  repository?: string;
  description?: string;
  tags?: { [key: string]: string };
}

export async function updatePackagesData(): Promise<string[]> {
  const packageWithNewVersion: string[] = [];

  const packages = PackageStore.get().getPackages();
  for (const key of Object.keys(packages)) {
    try {
      log.debug(`Update package "${packages[key].name}" start`);
      const updatedPackage = await PackageStore.get().updatePackage(
        key,
        packages[key].name,
        packages[key].registryUrl,
      );
      if (updatedPackage) {
        if (packages[key].latest !== updatedPackage.latest) {
          packageWithNewVersion.push(key);
        }
        log.debug(`Update package "${packages[key].name}" end`);
      } else {
        log.warn(`Unable to update "${packages[key].name}" package data.`);
      }
    } catch (err) {
      log.error(
        `Error while updating "${packages[key].name}" package data`,
        err,
      );
    }
  }

  return packageWithNewVersion;
}

export async function getPackageInfo(
  packageName: string,
): Promise<PackageInfo | undefined> {
  try {
    const packageData = await NpmRegistryApi.getPackageInfo(packageName);
    return {
      latest: packageData['dist-tags'].latest,
      license: packageData.license,
      homePage: packageData.homepage,
      repository: packageData.repository.url,
      description: packageData.description,
      tags: packageData['dist-tags'],
    };
  } catch (ex) {
    log.error(`Unable to fetch "${packageName}" info`, ex);
    return undefined;
  }
}
