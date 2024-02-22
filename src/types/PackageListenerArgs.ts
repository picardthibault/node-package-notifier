import { PackageDetails } from './PackageInfo';

export interface PackageCreationArgs {
  packageName: string;
  registryUrl?: string;
}

export interface PackageDetailsArgs {
  packageName: string;
  registryUrl: string;
}

export interface PackageSuggestionArgs {
  current: string;
  registryUrl?: string;
}

export type GetPackagesResult = Record<string, PackageDetails>;

export interface GetPackageResult {
  error?: string;
  packageDetails: PackageDetails;
}
