import log from 'electron-log';
import { PackageConfig, PackageStore } from '../../store/PackageStore';
import { PackageInfo, RegistryApi } from '../api/RegistryApi';
import i18n from '../../i18n';
import {
  PackageDetails,
  PackageSuggestionArgs,
  Tags,
} from '../../../types/PackageListenerArgs';
import { PackageCache } from '../../caches/PackageCache';

export const npmRegistryUrl = 'https://registry.npmjs.org';

function adaptRegistryUrl(registryUrl?: string) {
  return registryUrl ? registryUrl : npmRegistryUrl;
}

function mapPackageInfoToPackageDetails(
  registryUrl: string,
  packageName: string,
  packageInfo: PackageInfo,
): PackageDetails {
  return {
    name: packageName,
    registryUrl: registryUrl,
    license: packageInfo.license,
    homePage: packageInfo.homepage,
    repository: packageInfo.repository.url,
    description: packageInfo.description,
    latest: packageInfo['dist-tags']?.latest,
    tags: packageInfo['dist-tags'],
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
  const packageDetails = await fetchPackageDetails(
    adaptedRegistryUrl,
    packageName,
    true,
  );
  if (typeof packageDetails === 'string') {
    return packageDetails;
  }
  PackageStore.get().addPackage(packageDetails);
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
      const newPackageDetails = await fetchPackageDetails(
        adaptedRegistryUrl,
        packageToUpdate.name,
        true,
      );
      if (typeof newPackageDetails === 'string') {
        log.warn(
          `Unable to update "${packageToUpdate.name}" package data. Received error : ${newPackageDetails}`,
        );
      } else {
        const newPackageKey = PackageStore.get().updatePackage(
          key,
          newPackageDetails,
        );
        if (packageToUpdate.latest !== newPackageDetails.latest) {
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
 * @param registryUrl the url of the registry on which info will be fetched
 * @param packageName the name of the package for which info will be fetched
 * @param refresh indicates if cache value (if it exists) should be refreshed
 * @returns the information about the package fetched on the registry
 */
export async function fetchPackageDetails(
  registryUrl: string,
  packageName: string,
  refresh = false,
): Promise<PackageDetails | string> {
  log.debug(`Fetch package "${packageName} details`);
  // Search package info in PackageCache
  if (!refresh) {
    const packageInfo = PackageCache.get().get(registryUrl, packageName);
    if (packageInfo !== undefined) {
      return packageInfo;
    }
  }

  // Fetch package info if necessary
  try {
    const packageData = await RegistryApi.getPackageInfo(
      packageName,
      registryUrl,
    );
    const packageDetails = mapPackageInfoToPackageDetails(
      registryUrl,
      packageName,
      packageData,
    );
    await PackageCache.get().set(registryUrl, packageName, packageDetails);
    return packageDetails;
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

/**
 * Get package details
 *
 * @param packageConfig The package to fetch details
 * @returns The details of the package or an error message
 */
export async function getPackage(
  packageConfig: PackageConfig,
): Promise<PackageDetails | string> {
  log.debug(`Get package "${packageConfig.name}" details`);
  const packageDetails = await fetchPackageDetails(
    packageConfig.registryUrl,
    packageConfig.name,
  );
  return packageDetails;
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
