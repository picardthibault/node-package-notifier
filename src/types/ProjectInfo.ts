export interface ProjectSumUp {
  projectKey: string;
  name: string;
}

export interface ProjectDetails {
  name: string;
  path: string;
  registryUrl: string;
  parsedProject?: ParsedProject;
}

export interface ParsedProject {
  version: string;
  description?: string;
  dependencies: ParsedDependency[];
  devDependencies: ParsedDependency[];
}

export interface ParsedDependency {
  name: string;
  version: string;
}
