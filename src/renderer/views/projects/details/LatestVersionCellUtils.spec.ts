import { describe, test, expect } from '@jest/globals';
import { PackageVersionTagColor } from '@renderer/components/Tag/Tag';
import {
  compareWithRange,
  compareWithVersion,
  computeTagColor,
  isRange,
  isVersion,
} from './LatestVersionCellUtils';

describe('computeTagColor', () => {
  test('Given currentVersion "1.0.0" and latest version "1.0.5", should return GREEN', () => {
    const currentVersion = '1.0.0';
    const latestVersion = '1.0.5';

    const result = computeTagColor(currentVersion, latestVersion);

    expect(result).toBe(PackageVersionTagColor.GREEN);
  });

  test('Given currentVersion "1.0.2" and latest version "1.0.15", should return GREEN', () => {
    const currentVersion = '1.0.2';
    const latestVersion = '1.0.15';

    const result = computeTagColor(currentVersion, latestVersion);

    expect(result).toBe(PackageVersionTagColor.GREEN);
  });

  test('Given currentVersion "1.0.2" and latest version "1.0.15-RC12", should return GREEN', () => {
    const currentVersion = '1.0.2';
    const latestVersion = '1.0.15';

    const result = computeTagColor(currentVersion, latestVersion);

    expect(result).toBe(PackageVersionTagColor.GREEN);
  });

  test('Given currentVersion "1.0.0" and latest version "1.1.0", should return BLUE', () => {
    const currentVersion = '1.0.0';
    const latestVersion = '1.1.0';

    const result = computeTagColor(currentVersion, latestVersion);

    expect(result).toBe(PackageVersionTagColor.BLUE);
  });

  test('Given currentVersion "1.0.0" and latest version "1.1.12", should return BLUE', () => {
    const currentVersion = '1.0.0';
    const latestVersion = '1.1.12';

    const result = computeTagColor(currentVersion, latestVersion);

    expect(result).toBe(PackageVersionTagColor.BLUE);
  });

  test('Given currentVersion "1.1.0" and latest version "1.28.12", should return BLUE', () => {
    const currentVersion = '1.1.0';
    const latestVersion = '1.28.12';

    const result = computeTagColor(currentVersion, latestVersion);

    expect(result).toBe(PackageVersionTagColor.BLUE);
  });

  test('Given currentVersion "1.0.0" and latest version "2.0.0", should return RED', () => {
    const currentVersion = '1.0.0';
    const latestVersion = '2.0.0';

    const result = computeTagColor(currentVersion, latestVersion);

    expect(result).toBe(PackageVersionTagColor.RED);
  });

  test('Given currentVersion "1.0.0" and latest version "2.1.0", should return RED', () => {
    const currentVersion = '1.0.0';
    const latestVersion = '2.1.0';

    const result = computeTagColor(currentVersion, latestVersion);

    expect(result).toBe(PackageVersionTagColor.RED);
  });

  test('Given currentVersion "1.0.0" and latest version "2.0.2", should return RED', () => {
    const currentVersion = '1.0.0';
    const latestVersion = '2.0.2';

    const result = computeTagColor(currentVersion, latestVersion);

    expect(result).toBe(PackageVersionTagColor.RED);
  });

  test('Given currentVersion "1.0.0" and latest version "2.1.0", should return RED', () => {
    const currentVersion = '1.0.0';
    const latestVersion = '2.0.0';

    const result = computeTagColor(currentVersion, latestVersion);

    expect(result).toBe(PackageVersionTagColor.RED);
  });

  test('Given currentVersion "1.0." and latest version "2.1.0", should return undefined', () => {
    const currentVersion = '1.0.';
    const latestVersion = '2.1.0';

    const result = computeTagColor(currentVersion, latestVersion);

    expect(result).toBeUndefined();
  });

  test('Given currentVersion "1.0.0" and latest version "2.0", should return undefined', () => {
    const currentVersion = '1.0.0';
    const latestVersion = '2.0';

    const result = computeTagColor(currentVersion, latestVersion);

    expect(result).toBeUndefined();
  });
});

describe('isVersion', () => {
  test('Given "1.2.0", should return true', () => {
    const versionNumber = '1.2.0';

    const result = isVersion(versionNumber);

    expect(result).toBe(true);
  });

  test('Given "1.x", should return false', () => {
    const versionNumber = '1.x';

    const result = isVersion(versionNumber);

    expect(result).toBe(false);
  });
});

describe('isRange', () => {
  test('Given "1.0.0 - 1.23.0", should return true', () => {
    const versionNumber = '1.0.0 - 1.23.0';

    const result = isRange(versionNumber);

    expect(result).toBe(true);
  });

  test('Given "1.x", should return true', () => {
    const versionNumber = '1.x';

    const result = isRange(versionNumber);

    expect(result).toBe(true);
  });

  test('Given "~1.2", should return true', () => {
    const versionNumber = '~1.2';

    const result = isRange(versionNumber);

    expect(result).toBe(true);
  });

  test('Given "^1.2.0", should return true', () => {
    const versionNumber = '^1.2.0';

    const result = isRange(versionNumber);

    expect(result).toBe(true);
  });

  test('Given "1.2.0", should return true', () => {
    const versionNumber = '1.2.0';

    const result = isRange(versionNumber);

    expect(result).toBe(true);
  });
});

describe('compareWithRange', () => {
  test('Given range "1.x" with version "1.2.0", should return undefined', () => {
    const range = '1.x';
    const versionNumber = '1.2.0';

    const result = compareWithRange(range, versionNumber);

    expect(result).toBeUndefined();
  });

  test('Given range "1.0" with version "2.0.0", should return ORANGE', () => {
    const range = '1.x';
    const versionNumber = '2.0.0';

    const result = compareWithRange(range, versionNumber);

    expect(result).toBe(PackageVersionTagColor.ORANGE);
  });
});

describe('compareWithVersion', () => {
  test('Given version "1.0.0" and "1.0.0", should return undefined', () => {
    const version1 = '1.0.0';
    const version2 = '1.0.0';

    const result = compareWithVersion(version1, version2);

    expect(result).toBeUndefined();
  });

  test('Given version "2.0.0" and "1.0.0", should return undefined', () => {
    const version1 = '2.0.0';
    const version2 = '1.0.0';

    const result = compareWithVersion(version1, version2);

    expect(result).toBeUndefined();
  });

  test('Given version "1.0.0" and "1.0.0-RC1", should return undefined', () => {
    const version1 = '1.0.0';
    const version2 = '1.0.0';

    const result = compareWithVersion(version1, version2);

    expect(result).toBeUndefined();
  });

  test('Given version "1.0.0" and "1.0.1", should return GREEN', () => {
    const version1 = '1.0.0';
    const version2 = '1.0.1';

    const result = compareWithVersion(version1, version2);

    expect(result).toBe(PackageVersionTagColor.GREEN);
  });

  test('Given version "1.0.0" and "1.1.1", should return BLUE', () => {
    const version1 = '1.0.0';
    const version2 = '1.1.1';

    const result = compareWithVersion(version1, version2);

    expect(result).toBe(PackageVersionTagColor.BLUE);
  });

  test('Given version "1.0.0" and "2.1.1", should return RED', () => {
    const version1 = '1.0.0';
    const version2 = '2.1.1';

    const result = compareWithVersion(version1, version2);

    expect(result).toBe(PackageVersionTagColor.RED);
  });
});
