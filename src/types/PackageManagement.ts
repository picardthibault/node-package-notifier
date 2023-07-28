export interface PackageCreationArgs {
  packageName: string;
  registryUrl?: string;
}

export interface PackageUpdateArgs {
  packageId: string;
  packageName: string;
}
