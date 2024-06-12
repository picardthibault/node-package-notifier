import { ProjectDetails } from './ProjectInfo';

export interface ProjectCreationArgs {
  name: string;
  path: string;
  registryUrl?: string;
}

export interface ProjectCreationResult {
  projectKey: string;
  error?: string;
}

export interface GetProjectDetailsResult {
  projectDetails: ProjectDetails;
  error?: string;
}

export interface FetchLatestVersionArgs {
  dependencyName: string;
  registryUrl?: string;
}

export interface FetchPublicationDateArgs {
  dependencyName: string;
  dependencyVersion: string;
  registryUrl?: string;
}
