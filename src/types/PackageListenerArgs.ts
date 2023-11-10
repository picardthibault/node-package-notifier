export interface PackageCreationArgs {
  packageName: string;
  registryUrl?: string;
}

export interface PackageSuggestionArgs {
  current: string;
  registryUrl?: string;
}
