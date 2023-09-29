import log from 'electron-log';
import { stat, readdir } from 'fs/promises';

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
