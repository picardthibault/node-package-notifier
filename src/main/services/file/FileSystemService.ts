import log from 'electron-log';
import { stat, readdir, readFile } from 'fs/promises';
import i18n from '../../i18n';

export const isDirectory = async (path: string): Promise<boolean> => {
  try {
    const statResult = await stat(path);
    return statResult.isDirectory();
  } catch (err) {
    return false;
  }
};

export const readFiles = async (path: string): Promise<string[]> => {
  const isDir = isDirectory(path);
  if (isDir) {
    try {
      const files = await readdir(path);
      return files;
    } catch (err) {
      log.error(`An error occurred while reading "${path}" files.`, err);
      throw new Error(`Unable to read "${path}" files.`);
    }
  } else {
    throw new Error(`Path "${path}" is not a directory`);
  }
};

export const hasFiles = async (
  path: string,
  fileNames: string[],
): Promise<boolean> => {
  const files = await readFiles(path);

  return fileNames.reduce(
    (previous, curr) => previous && files.includes(curr),
    true,
  );
};

export const isFile = async (path: string): Promise<boolean> => {
  try {
    const statResult = await stat(path);
    return statResult.isFile();
  } catch (err) {
    return false;
  }
};

export const readFileContent = async (path: string): Promise<Buffer> => {
  log.info(`Read content of file "${path}"`);
  const exist = await isFile(path);
  if (!exist) {
    log.error(`Unable to read file with "${path}", it's not an existing file`);
    throw new Error(i18n.t('fileSystem.errors.fileDoesNotExist', { path }));
  }

  try {
    return readFile(path);
  } catch (err) {
    log.error(`Error while reading file with "${path}"`, err);
    throw new Error(
      i18n.t('fileSystem.errors.errorWhileReadingFile', { path }),
    );
  }
};
