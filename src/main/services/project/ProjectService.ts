import log from 'electron-log';
import { hasFiles, isDirectory } from '../file/FileSystemService';
import { ProjectStore } from '../../store/ProjectStore';
import i18n from '../../i18n';

const packageJsonFileName = 'package.json';

export const validateProjectPath = async (
  projectPath: string,
): Promise<string | undefined> => {
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
};

export const validateProjectName = (
  projectName: string,
): string | undefined => {
  log.info(`Validating project name "${projectName}"`);

  const isAlreadyUse = ProjectStore.get().hasProject(projectName);

  if (isAlreadyUse) {
    return i18n.t('project.validation.errors.nameAlreadyUsed');
  }

  return undefined;
};

export const importProject = async (
  projectName: string,
  projectPath: string,
): Promise<string> => {
  log.info(`Importing project with name "${projectName}"`);

  const isProjectNameValid = validateProjectName(projectName);
  if (isProjectNameValid) {
    throw new Error(isProjectNameValid);
  }

  const isProjectPathValid = await validateProjectPath(projectPath);
  if (isProjectPathValid) {
    throw new Error(isProjectPathValid);
  }

  const projectKey = ProjectStore.get().createProject(projectName, projectPath);

  return projectKey;
};
