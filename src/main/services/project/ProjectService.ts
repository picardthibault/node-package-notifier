import log from 'electron-log';
import {
  hasFiles,
  isDirectory,
  readFileContent,
} from '../file/FileSystemService';
import { ProjectStore } from '../../store/ProjectStore';
import i18n from '../../i18n';
import {
  ParsedDependency,
  ParsedProject,
  ProjectDetails,
} from '../../../types/ProjectListenerArgs';
import path from 'path';
import {
  adaptRegistryUrl,
  fetchPackageDetails,
  npmRegistryUrl,
} from '../package/PackageService';
import { ProjectSumUp } from '../../../types/ProjectInfo';

interface Dependencies {
  [key: string]: string;
}

interface PackageJson {
  version: string;
  description?: string;
  dependencies: Dependencies;
  devDependencies: Dependencies;
}

const packageJsonFileName = 'package.json';

/**
 * Check if the given name is already used
 *
 * @param projectName the given name
 * @returns true if the name is already used, otherwise returns false.
 */
export function isProjectNameUsed(projectName: string): boolean {
  log.info(`Checking if project name "${projectName}" is already used`);

  return ProjectStore.get().hasProject(projectName);
}

/**
 * Check if the given project path is valid
 *
 * @param projectPath the given project path
 * @returns undefined if the path is valid, otherwise an error message
 */
export async function validateProjectPath(
  projectPath: string,
): Promise<string | undefined> {
  log.info(`Validating project path "${projectPath}"`);

  const isDir = await isDirectory(projectPath);
  if (!isDir) {
    return i18n.t('project.validation.errors.notDirectory');
  }

  let hasPackageJson: boolean = false;
  try {
    hasPackageJson = await hasFiles(projectPath, [packageJsonFileName]);
  } catch (err) {
    log.error(
      `Error while checking presence of "${packageJsonFileName}" file in "${projectPath}".`,
      err,
    );
    hasPackageJson = false;
  }
  if (!hasPackageJson) {
    return i18n.t('project.validation.errors.noPackageJson');
  }

  return undefined;
}

/**
 * Import a new project
 *
 * @param projectName the given project name
 * @param projectPath the given project path
 * @param registryUrl the given registry url
 * @returns the created project key
 */
export async function createProject(
  projectName: string,
  projectPath: string,
  registryUrl?: string,
): Promise<string> {
  log.info(`Importing project with name "${projectName}"`);

  if (isProjectNameUsed(projectName)) {
    throw new Error(i18n.t('project.validation.errors.nameAlreadyUsed'));
  }

  const isProjectPathValid = await validateProjectPath(projectPath);
  if (isProjectPathValid) {
    throw new Error(isProjectPathValid);
  }

  const adaptedRegistryUrl = adaptRegistryUrl(registryUrl);
  const projectKey = ProjectStore.get().addProject(
    projectName,
    projectPath,
    adaptedRegistryUrl,
  );

  return projectKey;
}

/**
 * Retrieve all project sum-up
 *
 * @returns the table of project sum-up
 */
export const getProjectsSumUp = (): ProjectSumUp[] => {
  log.info('Retrieve projects data for menu');
  const projects = ProjectStore.get().getProjects();

  return Object.keys(projects).map((key) => ({
    projectKey: key,
    name: projects[key].name,
  }));
};

export const getProjectDetails = (projectKey: string): ProjectDetails => {
  log.info(`Retrieve project "${projectKey}" details`);

  const projectSavedData = ProjectStore.get().getProject(projectKey);
  return {
    name: projectSavedData.name,
    path: projectSavedData.path,
  };
};

export const parseProject = async (
  projectKey: string,
): Promise<ParsedProject | string> => {
  log.info(`Parse project "${projectKey}"`);

  const projectData = ProjectStore.get().getProject(projectKey);
  let packageJson: PackageJson;
  try {
    packageJson = await parsePackageJson(projectData.path);
  } catch (err) {
    log.error(
      `Unable to parse project package.json from "${projectData.path}"`,
      err,
    );
    if (err instanceof Error) {
      return err.message;
    } else {
      return i18n.t('project.parse.unknownError');
    }
  }

  const dependencies = await parseProjectDependencies(packageJson);
  const devDepencies = await parseProjectDevDependencies(packageJson);

  return {
    name: projectData.name,
    path: projectData.path,
    version: packageJson.version,
    description: packageJson.description,
    dependencies: dependencies,
    devDependencies: devDepencies,
  };
};

const parsePackageJson = async (projectPath: string): Promise<PackageJson> => {
  const packageJsonPath = path.join(projectPath, packageJsonFileName);
  log.info(`Parse package.json project file "${packageJsonPath}"`);
  const packageJsonContent = await readFileContent(packageJsonPath);
  return JSON.parse(packageJsonContent.toString());
};

const parseProjectDependencies = async (
  packageJson: PackageJson,
): Promise<ParsedDependency[]> => {
  log.info('Parse project dependencies');
  return parseDependencies(packageJson.dependencies);
};

const parseProjectDevDependencies = async (
  packageJson: PackageJson,
): Promise<ParsedDependency[]> => {
  log.info('Parse project devDepencies');
  return parseDependencies(packageJson.devDependencies);
};

const parseDependencies = (dependencies: Dependencies): ParsedDependency[] => {
  return Object.keys(dependencies).map((key) => ({
    name: key,
    currentVersion: dependencies[key],
  }));
};

export const fetchLatestsVersions = async (
  dependencies: string[],
): Promise<Map<string, string | undefined>> => {
  const dependencyWithLatestVersion = new Map<string, string | undefined>();

  for (const dependency of dependencies) {
    log.debug(`Fetch latest version of package "${dependency}"`);
    // TODO : Handle registry url
    const packageDetails = await fetchPackageDetails(
      dependency,
      npmRegistryUrl,
    );
    if (typeof packageDetails === 'string') {
      log.warn(
        `Error while fetching package "${dependencies}" details. Cause: ${packageDetails}`,
      );
      dependencyWithLatestVersion.set(dependency, undefined);
    } else {
      dependencyWithLatestVersion.set(dependency, packageDetails.latest);
    }
  }

  return dependencyWithLatestVersion;
};
