import log from 'electron-log';
import { PackageStore, isPackageConfig } from '../../store/PackageStore';
import { RegistryApi } from '../api/RegistryApi';
import i18n from '../../i18n';
import { PackageSuggestionArgs } from '../../../types/PackageManagement';

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

export async function updatePackagesData(): Promise<string[]> {
  const packageWithNewVersion: string[] = [];

  const packages = PackageStore.get().getPackages();
  for (const key of Object.keys(packages)) {
    try {
      log.debug(`Update package "${packages[key].name}" start`);
      const updatedResult = await PackageStore.get().updatePackage(
        key,
        packages[key].name,
        packages[key].registryUrl,
      );
      if (isPackageConfig(updatedResult)) {
        if (packages[key].latest !== updatedResult.latest) {
          packageWithNewVersion.push(key);
        }
        log.debug(`Update package "${packages[key].name}" end`);
      } else {
        log.warn(
          `Unable to update "${packages[key].name}" package data. Received error : ${updatedResult}`,
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
  const packageInfo = await getPackageInfo(
    savedPackageData.name,
    savedPackageData.registryUrl,
  );

  if (typeof packageInfo === 'string') {
    return packageInfo;
  } else {
    return packageInfo.tags;
  }
}

export async function getPackageSuggestions(
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
