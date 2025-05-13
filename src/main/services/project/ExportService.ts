import log from 'electron-log';
import {
  fetchLatestVersion,
  getProjectDetails,
} from '@main/services/project/ProjectService.js';
import i18n from '../../i18n.js';
import {
  ParsedDependency,
  ParsedDependencyWithNewVersion,
} from '@type/ProjectInfo.js';
import { gt, satisfies, valid, validRange } from 'semver';
import { GetProjectDetailsResult } from '@type/ProjectListenerArgs.js';
import { extname } from 'path';
import { writeFileContent } from '../file/FileSystemService.js';

export const exportDependenciesWithNewVersion = async (
  projectKey: string,
  outputFilePath: string,
): Promise<string | undefined> => {
  log.info(`Export dependencies with new version from project "${projectKey}"`);

  const projectDetails = await getProjectDetails(projectKey);
  if (projectDetails.error || !projectDetails.projectDetails.parsedProject) {
    return i18n.t('project.export.error.unableToRetrieveProjectDependencies');
  }

  const runtimeDependenciesWithNewVersion =
    await extractDependenciesWithNewVersion(
      projectDetails.projectDetails.parsedProject.dependencies,
      projectDetails.projectDetails.registryUrl,
    );
  const devDependenciesWithNewVersion = await extractDependenciesWithNewVersion(
    projectDetails.projectDetails.parsedProject.devDependencies,
    projectDetails.projectDetails.registryUrl,
  );

  const exportContent = createDependenciesWithNewVersionExport(
    projectDetails,
    runtimeDependenciesWithNewVersion,
    devDependenciesWithNewVersion,
  );

  await saveDependenciesWithNewVersionExport(outputFilePath, exportContent);

  return undefined;
};

/**
 * Extract from parsed dependencies the list of dependencies with new version
 *
 * @param dependencies the parsed dependencies
 * @param registryUrl the url of the registry on which latest version should be fetched
 * @returns the list of dependencies with newer version
 */
const extractDependenciesWithNewVersion = async (
  dependencies: ParsedDependency[],
  registryUrl: string,
): Promise<ParsedDependencyWithNewVersion[]> => {
  log.info('Extract dependencies with new version');

  const dependenciesWithNewVersion: ParsedDependencyWithNewVersion[] = [];
  for (const dependency of dependencies) {
    const dependencyLatestVersion = await fetchLatestVersion(
      dependency.name,
      registryUrl,
    );
    if (
      dependencyLatestVersion &&
      dependencyHasNewVersion(dependency.version, dependencyLatestVersion)
    ) {
      dependenciesWithNewVersion.push({
        ...dependency,
        newVersion: dependencyLatestVersion,
      });
    }
  }

  return dependenciesWithNewVersion;
};

/**
 * Identify if a given dependency has a new version available
 *
 * @param dependencyVersion the current version of the dependency
 * @param dependencyLatestVersion the latest version of the dependency
 * @returns true if the latest version of the dependency is newer than the current dependency version
 */
const dependencyHasNewVersion = (
  dependencyVersion: string,
  dependencyLatestVersion: string,
): boolean => {
  if (valid(dependencyVersion) !== null) {
    return gt(dependencyLatestVersion, dependencyVersion);
  }
  if (validRange(dependencyVersion) !== null) {
    return !satisfies(dependencyLatestVersion, dependencyVersion);
  }
  return false;
};

/**
 * Create export dependencies with new version content
 *
 * @param projectDetails the detail of project
 * @param runtimeDependenciesWithNewVersion the list of runtime dependencies with new version
 * @param devDependenciesWithNewVersion the list of dev dependencies with new version
 * @returns the content of the export dependencies with new version
 */
const createDependenciesWithNewVersionExport = (
  projectDetails: GetProjectDetailsResult,
  runtimeDependenciesWithNewVersion: ParsedDependencyWithNewVersion[],
  devDependenciesWithNewVersion: ParsedDependencyWithNewVersion[],
): string => {
  const divider = '\n\n';
  let result = projectDetails.projectDetails.name;
  result += divider;
  result += 'The following runtime dependencies have newer versions :\n';
  result += runtimeDependenciesWithNewVersion
    .map((dependencyWithNewVersion) =>
      formatDependencyWithNewVersion(dependencyWithNewVersion),
    )
    .join('\n');
  result += divider;
  result += 'The following dev dependencies have newer versions :\n';
  result += devDependenciesWithNewVersion
    .map((dependencyWithNewVersion) =>
      formatDependencyWithNewVersion(dependencyWithNewVersion),
    )
    .join('\n');
  return result;
};

/**
 * Format the string for a dependency with new version
 *
 * @param dependencyWithNewVersion a dependency with new version
 * @returns the formated dependency string
 */
const formatDependencyWithNewVersion = (
  dependencyWithNewVersion: ParsedDependencyWithNewVersion,
) => {
  return `${dependencyWithNewVersion.name.padEnd(30, ' ')}\t${dependencyWithNewVersion.version} -> ${dependencyWithNewVersion.newVersion}`;
};

/**
 * Save the export content
 *
 * @param outputFilePath the path to the file
 * @param exportContent the export content to save
 */
const saveDependenciesWithNewVersionExport = async (
  outputFilePath: string,
  exportContent: string,
): Promise<void> => {
  const output = computeOutputFilePath(outputFilePath);
  log.info(`Save export dependency with new version file at "${output}"`);
  await writeFileContent(output, exportContent);
};

/**
 * Compute output file path
 *
 * @param outputFilePath the entered output file path
 * @returns the compute output file path with the expected extension
 */
const computeOutputFilePath = (outputFilePath: string): string => {
  const extensionName = extname(outputFilePath);
  return extensionName === '.txt' ? outputFilePath : `${outputFilePath}.txt`;
};
