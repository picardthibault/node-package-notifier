export interface PackageDetails {
  name: string;
  registryUrl: string;
  license?: string;
  homePage?: string;
  repository?: string;
  description?: string;
  latest?: string;
  tags?: Tags;
  time?: Time;
}

export type Tags = Record<string, string>;
export type Time = Record<string, string | undefined>;
