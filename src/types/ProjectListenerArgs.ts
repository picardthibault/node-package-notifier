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
