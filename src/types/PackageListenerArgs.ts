import { PackageDetails } from "./PackageInfo";

export interface PackageCreationArgs {
  packageName: string;
  registryUrl?: string;
}

export interface PackageSuggestionArgs {
  current: string;
  registryUrl?: string;
}

export interface GetPackagesResult {
  [key: string]: PackageDetails;
}

export interface GetPackageResult {
  error?: string;
  packageDetails: PackageDetails;
}
