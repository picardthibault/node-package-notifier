import { PackageVersionTagColor } from '@renderer/components/Tag/Tag';
import i18n from '../../../i18n';
import semver from 'semver';

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
    case PackageVersionTagColor.ORANGE:
      return i18n.t('project.details.tooltip.outsideRange');
    default:
      return undefined;
  }
};

export const computeTagColor = (
  currentVersion: string,
  latestVersion?: string,
): PackageVersionTagColor | undefined => {
  if (!latestVersion || !isVersion(latestVersion)) {
    return undefined;
  }

  if (isVersion(currentVersion)) {
    return compareWithVersion(currentVersion, latestVersion);
  } else if (isRange(currentVersion)) {
    return compareWithRange(currentVersion, latestVersion);
  } else {
    return undefined;
  }
}

export const isVersion = (versionNumber: string): boolean => {
  return semver.valid(versionNumber) != null;
};

export const isRange = (versionNumber: string): boolean => {
  return semver.validRange(versionNumber) != null;
};

export const compareWithRange = (currentVersion: string, latestVersion: string): PackageVersionTagColor | undefined => {
  return semver.satisfies(latestVersion, currentVersion) ? undefined : PackageVersionTagColor.ORANGE;
};

export const compareWithVersion = (currentVersion: string, latestVersion: string): PackageVersionTagColor | undefined => {
  if (semver.lt(latestVersion, currentVersion)) {
    return undefined;
  }

  const diff = semver.diff(currentVersion, latestVersion);
  switch (diff) {
    case 'major':
      return PackageVersionTagColor.RED;
    case "minor":
      return PackageVersionTagColor.BLUE;
    case "patch":
      return PackageVersionTagColor.GREEN;
    default:
      return undefined;
  }
};
