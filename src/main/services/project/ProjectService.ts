import log from 'electron-log';
import { hasFiles, isDirectory } from '../file/FileSystemService';
import { ProjectPathValidationResult } from '../../../types/ProjectInfo';

const packageJsonFileName = 'package.json';

export const validateProjectPath = async (
  projectPath: string,
): Promise<ProjectPathValidationResult> => {
  const isDir = await isDirectory(projectPath);

  let hasPackageJson: boolean = false;
  if (isDir) {
    try {
      hasPackageJson = await hasFiles(projectPath, [packageJsonFileName]);
    } catch (err) {
      log.error(
        `Error while checking presence of "${packageJsonFileName}" file in "${projectPath}".`,
        err,
      );
      hasPackageJson = false;
    }
  }

  return {
    isDirectory: isDir,
    hasPackageJson,
  };
};
