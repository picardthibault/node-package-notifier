import log from 'electron-log';
import {
  hasFiles,
  isDirectory,
  readFileContent,
} from '../file/FileSystemService';
import { ProjectConfig, ProjectStore } from '../../store/ProjectStore';
import i18n from '../../i18n';
import path from 'path';
import {
  adaptRegistryUrl,
  fetchPackageDetails,
  npmRegistryUrl,
} from '../package/PackageService';
import {
  ParsedDependency,
  ParsedProject,
  ProjectDetails,
  ProjectSumUp,
} from '../../../types/ProjectInfo';
import { GetProjectDetailsResult } from '../../../types/ProjectListenerArgs';

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

/**
 * Get project details
 *
 * @param projectKey the project to get details
 * @returns the details of the project
 */
export const getProjectDetails = async (
  projectKey: string,
): Promise<GetProjectDetailsResult> => {
  log.info(`Retrieve project "${projectKey}" details`);

  const projectConfig = ProjectStore.get().getProject(projectKey);

  let parsedProject: ParsedProject | undefined;
  let error: string | undefined;
  try {
    parsedProject = await parseProject(projectConfig);
  } catch (err) {
    error = i18n.t('project.parse.error');
  }

  const projectDetails: ProjectDetails = {
    name: projectConfig.name,
    path: projectConfig.path,
    registryUrl: projectConfig.registryUrl,
    parsedProject: parsedProject,
  };

  return {
    projectDetails: projectDetails,
    error: error,
  };
};

/**
 * Parse project details
 *
 * @param projectConfig the project configuration to parse
 * @returns the parsed details of the project
 */
export const parseProject = async (
  projectConfig: ProjectConfig,
): Promise<ParsedProject> => {
  log.info(`Parse project "${projectConfig.name}"`);
  let packageJson: PackageJson;
  try {
    packageJson = await parsePackageJson(projectConfig.path);
  } catch (err) {
    log.error(
      `Unable to parse project package.json from "${projectConfig.path}"`,
      err,
    );
    throw err;
  }

  log.info('Parse project dependencies');
  const dependencies = parseDependencies(packageJson.dependencies);

  log.info('Parse project devDepencies');
  const devDepencies = parseDependencies(packageJson.devDependencies);

  return {
    version: packageJson.version,
    description: packageJson.description,
    dependencies: dependencies,
    devDependencies: devDepencies,
  };
};

/**
 * Parse project package.json file
 *
 * @param projectPath the path to the project folder
 * @returns the parsed package.json file
 */
const parsePackageJson = async (projectPath: string): Promise<PackageJson> => {
  const packageJsonPath = path.join(projectPath, packageJsonFileName);
  log.info(`Parse package.json project file "${packageJsonPath}"`);
  const packageJsonContent = await readFileContent(packageJsonPath);
  return JSON.parse(packageJsonContent.toString());
};

/**
 * Parse project dependencies
 *
 * @param dependencies the dependencies of a parsed package.json file
 * @returns An array of the parsed dependencies, if the dependencies is null then return empty array
 */
const parseDependencies = (dependencies: Dependencies): ParsedDependency[] => {
  if (!dependencies) {
    return [];
  }

  return Object.keys(dependencies).map((key) => ({
    name: key,
    version: dependencies[key],
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
