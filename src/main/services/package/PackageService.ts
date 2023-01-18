import { PackageConfig, PackageStore } from '../../store/PackageStore';
import { NpmRegistryApi } from '../api/NpmRegistryApi';

export async function updatePackagesData(): Promise<string[]> {
  const packageWithNewVersion: string[] = [];

  const packages = PackageStore.get().getPackages();
  for (const key of Object.keys(packages)) {
    try {
      console.debug(`Update package "${packages[key].name}" start`);
      const packageData = await NpmRegistryApi.getPackageInfo(
        packages[key].name,
      );
      const newPackageConfig: PackageConfig = {
        ...packages[key],
        latest: packageData['dist-tags'].latest,
      };
      if (packages[key].latest !== newPackageConfig.latest) {
        packageWithNewVersion.push(key);
      }
      PackageStore.get().updatePackage(key, newPackageConfig);
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
