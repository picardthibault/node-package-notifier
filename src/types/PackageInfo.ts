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

export type Tags = Record<string, string>;
