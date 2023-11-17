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

export interface PackageDetails {
  name: string;
  registryUrl: string;
  license?: string;
  homePage?: string;
  repository?: string;
  description?: string;
  latest?: string;
  tags?: Tags;
}

export interface Tags {
  [key: string]: string;
}
