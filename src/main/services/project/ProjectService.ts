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

export const importProject = (
  projectName: string,
  projectPath: string,
): string => {
  log.info(`Importing project with name "${projectName}"`);

  const isProjectNameValid = validateProjectName(projectName);
  if (!isProjectNameValid) {
    // todo
  }

  const isProjectPathValid = validateProjectPath(projectPath);
  if (!isProjectPathValid) {
    // todo
  }

  const projectKey = ProjectStore.get().createProject(projectName, projectPath);

  return projectKey;
};
