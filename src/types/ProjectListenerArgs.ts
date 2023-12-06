export interface ProjectCreationArgs {
  name: string;
  path: string;
  registryUrl?: string;
}

export interface ProjectCreationResult {
  projectKey: string;
  error: string;
}

export interface ProjectDetails {
  name: string;
  path: string;
}

export interface ParsedDependency {
  name: string;
  currentVersion: string;
}

export interface ParsedProject {
  name: string;
  path: string;
  version: string;
  description?: string;
  dependencies: ParsedDependency[];
  devDependencies: ParsedDependency[];
}
