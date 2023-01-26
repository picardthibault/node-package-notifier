import { PackageConfig, PackageStore } from '../../store/PackageStore';
import { NpmRegistryApi } from '../api/NpmRegistryApi';

export interface PackageInfo {
  latest?: string;
  license?: string;
}

export async function updatePackagesData(): Promise<string[]> {
  const packageWithNewVersion: string[] = [];

  const packages = PackageStore.get().getPackages();
  for (const key of Object.keys(packages)) {
    try {
      console.debug(`Update package "${packages[key].name}" start`);
      const packageInfo = await getPackageInfo(packages[key].name);
      const newPackageConfig: PackageConfig = {
        ...packages[key],
        latest: packageInfo.latest,
        license: packageInfo.license,
      };
      if (packages[key].latest !== newPackageConfig.latest) {
        packageWithNewVersion.push(key);
      }
      await PackageStore.get().updatePackage(key, newPackageConfig);
      console.debug(`Update package "${packages[key].name}" end`);
    } catch (err) {
      console.error(
        `Error while updating ${packages[key].name} package data`,
        err,
      );
    }
  }

  return packageWithNewVersion;
}

export async function getPackageInfo(
  packageName: string,
): Promise<PackageInfo> {
  const packageData = await NpmRegistryApi.getPackageInfo(packageName);
  return {
    latest: packageData['dist-tags'].latest,
    license: packageData.license,
  };
}
