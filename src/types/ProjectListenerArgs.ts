export interface ProjectImportArgs {
  name: string;
  path: string;
}

export interface ProjectImportResult {
  projectKey: string;
  error: string;
}

export interface ProjectDataForMenu {
  projectKey: string;
  name: string;
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
