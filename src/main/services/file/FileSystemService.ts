import log from 'electron-log';
import { statSync, readdirSync } from 'fs';

export const isDirectory = (path: string): boolean => {
  try {
    const statResult = statSync(path);
    return statResult.isDirectory();
  } catch (err) {
    return false;
  }
};

export const readFiles = (path: string): string[] => {
  const isDir = isDirectory(path);
  if (isDir) {
    try {
      const files = readdirSync(path);
      return files;
    } catch (err) {
      log.error(`An error occurred while reading "${path}" files.`, err);
      throw new Error(`Unable to read "${path}" files.`);
    }
  } else {
    throw new Error(`Path "${path}" is not a directory`);
  }
};

export const hasFiles = (path: string, fileNames: string[]): boolean => {
  const files = readFiles(path);

  return fileNames.reduce(
    (previous, curr) => previous && files.includes(curr),
    true,
  );
};
