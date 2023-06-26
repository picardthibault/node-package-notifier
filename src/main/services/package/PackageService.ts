import log from 'electron-log';
import { PackageConfig, PackageStore } from '../../store/PackageStore';
import { NpmRegistryApi } from '../api/NpmRegistryApi';

export interface PackageInfo {
  latest?: string;
  license?: string;
  homePage?: string;
  repository?: string;
  description?: string;
}

export async function updatePackagesData(): Promise<string[]> {
  const packageWithNewVersion: string[] = [];

  const packages = PackageStore.get().getPackages();
  for (const key of Object.keys(packages)) {
    try {
      log.debug(`Update package "${packages[key].name}" start`);
      const packageInfo = await getPackageInfo(packages[key].name);
      if (packageInfo) {
        const newPackageConfig: PackageConfig = {
          ...packages[key],
          latest: packageInfo.latest,
          license: packageInfo.license,
        };
        if (packages[key].latest !== packageInfo.latest) {
          packageWithNewVersion.push(key);
        }
        await PackageStore.get().updatePackage(key, packages[key].name, packages[key].registryUrl);
        log.debug(`Update package "${packages[key].name}" end`);
      } else {
        log.warn(
          `Unable to fetch "${packages[key].name}" package data. The package has not been updated`,
        );
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
    };
  } catch (ex) {
    log.error(`Unable to fetch "${packageName}" info`, ex);
    return undefined;
  }
}
