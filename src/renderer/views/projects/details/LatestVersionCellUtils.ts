import { PackageVersionTagColor } from '@renderer/components/Tag/Tag';
import i18n from '../../../i18n';

interface SplitVersionNumber {
  major: number;
  minor: number;
  patch: number;
}

export const computeTagTooltip = (
  tagColor?: PackageVersionTagColor,
): string | undefined => {
  switch (tagColor) {
    case PackageVersionTagColor.RED:
      return i18n.t('project.details.tooltip.newMajor');
    case PackageVersionTagColor.BLUE:
      return i18n.t('project.details.tooltip.newMinor');
    case PackageVersionTagColor.GREEN:
      return i18n.t('project.details.tooltip.newPatch');
    default:
      return undefined;
  }
};

export const computeTagColor = (
  currentVersion: string,
  latestVersion?: string,
): PackageVersionTagColor | undefined => {
  if (!latestVersion) {
    return undefined;
  }

  let splitCurrentVersion: SplitVersionNumber;
  let splitLatestVersion: SplitVersionNumber;
  try {
    splitCurrentVersion = splitVersionNumber(currentVersion);
    splitLatestVersion = splitVersionNumber(latestVersion);
  } catch (err) {
    return undefined;
  }

  if (splitCurrentVersion.major < splitLatestVersion.major) {
    return PackageVersionTagColor.RED;
  }

  if (splitCurrentVersion.minor < splitLatestVersion.minor) {
    return PackageVersionTagColor.BLUE;
  }

  if (splitCurrentVersion.patch < splitLatestVersion.patch) {
    return PackageVersionTagColor.GREEN;
  }

  return undefined;
};

export const splitVersionNumber = (
  versionNumber: string,
): SplitVersionNumber => {
  const versionNumberFormatRegexp = /^([0-9]+)\.([0-9]+)\.([0-9]+)[^.]*$/;

  const assertVersionNumberFormat =
    versionNumberFormatRegexp.exec(versionNumber);

  if (!assertVersionNumberFormat) {
    throw new Error('Invalid version number format');
  }

  return {
    major: parseInt(assertVersionNumberFormat[1]),
    minor: parseInt(assertVersionNumberFormat[2]),
    patch: parseInt(assertVersionNumberFormat[3]),
  };
};

export const cleanPatchVersionNumber = (patchVersionNumber: string): string => {
  let cleanedVersion = '';
  for (const character of patchVersionNumber) {
    if (/[0-9]/.test(character)) {
      cleanedVersion += character;
    } else {
      break;
    }
  }
  return cleanedVersion;
};
