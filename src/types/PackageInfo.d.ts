export interface PackageData {
  name: string;
  registryUrl: string;
  license?: string;
  homePage?: string;
  repository?: string;
  description?: string;
  latest?: string;
}

export interface Tags {
  [key: string]: string;
}
