import log from 'electron-log';
import { PackageStore } from '../../store/PackageStore';
import { RegistryApi } from '../api/RegistryApi';
import i18n from '../../i18n';
import { PackageSuggestionArgs } from '../../../types/PackageListenerArgs';

export interface Tags {
  [key: string]: string;
}

export interface PackageInfo {
  latest?: string;
  license?: string;
  homePage?: string;
  repository?: string;
  description?: string;
  tags?: Tags;
}

export const npmRegistryUrl = 'https://registry.npmjs.org';

function adaptRegistryUrl(registryUrl?: string) {
  return registryUrl ? registryUrl : npmRegistryUrl;
}

function mapPackageInfoToPackageConfig(
  packageName: string,
  registryUrl: string,
  packageInfo: PackageInfo,
) {
  return {
    name: packageName,
    registryUrl: registryUrl,
    license: packageInfo.license,
    homePage: packageInfo.homePage,
    repository: packageInfo.repository,
    description: packageInfo.description,
    latest: packageInfo.latest,
  };
}

/**
 * Create package in the package store
 *
 * @param packageName the name of the package to add to the package store
 * @param registryUrl the url of the registry on which package details should be fetched
 * @returns an error message if an error occurred
 */
export async function createPackage(
  packageName: string,
  registryUrl?: string,
): Promise<string | undefined> {
  const adaptedRegistryUrl = adaptRegistryUrl(registryUrl);
  const packageInfo = await fetchPackageInfo(packageName, adaptedRegistryUrl);
  if (typeof packageInfo === 'string') {
    return packageInfo;
  }
  const packageConfig = mapPackageInfoToPackageConfig(
    packageName,
    adaptedRegistryUrl,
    packageInfo,
  );
  PackageStore.get().addPackage(packageConfig);
}

/**
 *  Update all package present in the package store
 *
 * @returns The list of key of the package store for which the package has a newer version
 */
export async function updateAllStoredPackages(): Promise<string[]> {
  const packageWithNewVersion: string[] = [];

  const packages = PackageStore.get().getPackages();
  for (const key of Object.keys(packages)) {
    const packageToUpdate = packages[key];
    try {
      log.debug(`Update package "${packageToUpdate.name}" start`);
      const adaptedRegistryUrl = adaptRegistryUrl(packageToUpdate.registryUrl);
      const newPackageInfo = await fetchPackageInfo(
        packageToUpdate.name,
        adaptedRegistryUrl,
      );
      if (typeof newPackageInfo === 'string') {
        log.warn(
          `Unable to update "${packageToUpdate.name}" package data. Received error : ${newPackageInfo}`,
        );
      } else {
        const newPackageConfig = mapPackageInfoToPackageConfig(
          packageToUpdate.name,
          adaptedRegistryUrl,
          newPackageInfo,
        );
        const newPackageKey = PackageStore.get().updatePackage(
          key,
          newPackageConfig,
        );
        if (packageToUpdate.latest !== newPackageConfig.latest) {
          packageWithNewVersion.push(newPackageKey);
        }
        log.debug(`Update package "${packageToUpdate.name}" end`);
      }
    } catch (err) {
      log.error(
        `Error while updating "${packageToUpdate.name}" package data`,
        err,
      );
    }
  }

  return packageWithNewVersion;
}

/**
 * Delete package in the package store
 * @param packageKey the key associated to the package to delete
 */
export function deletePackage(packageKey: string) {
  PackageStore.get().deletePackage(packageKey);
}

/**
 * Fetch information about a package on a registry
 *
 * @param packageName the name of the package for which info will be fetched
 * @param registryUrl the url of the registry on which info will be fetched
 * @returns the information about the package fetched on the registry
 */
export async function fetchPackageInfo(
  packageName: string,
  registryUrl: string,
): Promise<PackageInfo | string> {
  try {
    const packageData = await RegistryApi.getPackageInfo(
      packageName,
      registryUrl,
    );
    return {
      latest: packageData['dist-tags']?.latest,
      license: packageData.license,
      homePage: packageData.homepage,
      repository: packageData.repository?.url,
      description: packageData.description,
      tags: packageData['dist-tags'],
    };
  } catch (err) {
    if (err instanceof Error) {
      log.error(`Received an error while fetching "${packageName}" info.`, err);
      return err.message;
    } else {
      log.error(
        `Received an unknown error while fetching "${packageName}" info. Error : ${JSON.stringify(
          err,
        )}`,
      );
      return i18n.t('package.fetch.errors.unknownResponse');
    }
  }
}

export async function getPackageTags(
  packageId: string,
): Promise<Tags | undefined | string> {
  const savedPackageData = PackageStore.get().getPackage(packageId);
  const packageInfo = await fetchPackageInfo(
    savedPackageData.name,
    savedPackageData.registryUrl,
  );

  if (typeof packageInfo === 'string') {
    return packageInfo;
  } else {
    return packageInfo.tags;
  }
}

/**
 * Fetch a list of package suggestions based on given information
 *
 * @param suggestionArgs information need to fetch suggestions
 * @returns a list of proposed packages
 */
export async function fetchPackageSuggestions(
  suggestionArgs: PackageSuggestionArgs,
): Promise<string[] | string> {
  const registryUrl = suggestionArgs.registryUrl
    ? suggestionArgs.registryUrl
    : npmRegistryUrl;
  try {
    const suggestions = await RegistryApi.getSuggestions(
      suggestionArgs.current,
      registryUrl,
    );

    return suggestions.objects.map((object) => object.package.name);
  } catch (err) {
    if (err instanceof Error) {
      log.error(
        `Received an error while fetching package suggestions for "${suggestionArgs.current}" on ${registryUrl}.`,
        err,
      );
      return err.message;
    } else {
      log.error(
        `Received an unknown error while fetching package suggestions. Error : ${JSON.stringify(
          err,
        )}`,
      );
      return i18n.t('package.fetch.errors.unknownResponse');
    }
  }
}
