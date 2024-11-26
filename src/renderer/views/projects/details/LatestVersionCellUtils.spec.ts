import { describe, test, expect } from "@jest/globals";
import { PackageVersionTagColor } from "@renderer/components/Tag/Tag";
import { cleanPatchVersionNumber, computeTagColor, splitVersionNumber } from "./LatestVersionCellUtils";

describe('computeTagColor', () => {
    test('Given currentVersion "1.0.0" and latest version "1.0.5", should return GREEN', () => {
        const currentVersion = "1.0.0";
        const latestVersion = "1.0.5";

        const result = computeTagColor(currentVersion, latestVersion);

        expect(result).toBeDefined();
        expect(result).toBe(PackageVersionTagColor.GREEN);
    });

    test('Given currentVersion "1.0.2" and latest version "1.0.15", should return GREEN', () => {
        const currentVersion = "1.0.2";
        const latestVersion = "1.0.15";

        const result = computeTagColor(currentVersion, latestVersion);

        expect(result).toBeDefined();
        expect(result).toBe(PackageVersionTagColor.GREEN);
    });

    test('Given currentVersion "1.0.2" and latest version "1.0.15-RC12", should return GREEN', () => {
        const currentVersion = "1.0.2";
        const latestVersion = "1.0.15";

        const result = computeTagColor(currentVersion, latestVersion);

        expect(result).toBeDefined();
        expect(result).toBe(PackageVersionTagColor.GREEN);
    });

    test('Given currentVersion "1.0.0" and latest version "1.1.0", should return BLUE', () => {
        const currentVersion = "1.0.0";
        const latestVersion = "1.1.0";

        const result = computeTagColor(currentVersion, latestVersion);

        expect(result).toBeDefined();
        expect(result).toBe(PackageVersionTagColor.BLUE);
    });

    test('Given currentVersion "1.0.0" and latest version "1.1.12", should return BLUE', () => {
        const currentVersion = "1.0.0";
        const latestVersion = "1.1.12";

        const result = computeTagColor(currentVersion, latestVersion);

        expect(result).toBeDefined();
        expect(result).toBe(PackageVersionTagColor.BLUE);
    });

    test('Given currentVersion "1.1.0" and latest version "1.28.12", should return BLUE', () => {
        const currentVersion = "1.1.0";
        const latestVersion = "1.28.12";

        const result = computeTagColor(currentVersion, latestVersion);

        expect(result).toBeDefined();
        expect(result).toBe(PackageVersionTagColor.BLUE);
    });

    test('Given currentVersion "1.0.0" and latest version "2.0.0", should return RED', () => {
        const currentVersion = "1.0.0";
        const latestVersion = "2.0.0";

        const result = computeTagColor(currentVersion, latestVersion);

        expect(result).toBeDefined();
        expect(result).toBe(PackageVersionTagColor.RED);
    });

    test('Given currentVersion "1.0.0" and latest version "2.1.0", should return RED', () => {
        const currentVersion = "1.0.0";
        const latestVersion = "2.1.0";

        const result = computeTagColor(currentVersion, latestVersion);

        expect(result).toBeDefined();
        expect(result).toBe(PackageVersionTagColor.RED);
    });

    test('Given currentVersion "1.0.0" and latest version "2.0.2", should return RED', () => {
        const currentVersion = "1.0.0";
        const latestVersion = "2.0.2";

        const result = computeTagColor(currentVersion, latestVersion);

        expect(result).toBeDefined();
        expect(result).toBe(PackageVersionTagColor.RED);
    });

    test('Given currentVersion "1.0.0" and latest version "2.1.0", should return RED', () => {
        const currentVersion = "1.0.0";
        const latestVersion = "2.0.0";

        const result = computeTagColor(currentVersion, latestVersion);

        expect(result).toBeDefined();
        expect(result).toBe(PackageVersionTagColor.RED);
    });

    test('Given currentVersion "1.0." and latest version "2.1.0", should return undefined', () => {
        const currentVersion = "1.0.";
        const latestVersion = "2.1.0";

        const result = computeTagColor(currentVersion, latestVersion);

        expect(result).not.toBeDefined();
    });

    test('Given currentVersion "1.0.0" and latest version "2.0", should return undefined', () => {
        const currentVersion = "1.0.0";
        const latestVersion = "2.0";

        const result = computeTagColor(currentVersion, latestVersion);

        expect(result).not.toBeDefined();
    });
});

describe('splitVersionNumber', () => {
    test('Given version number "15.18.0", should return split version number object with major equal to 15, minor equal to 18 and patch equal to 0', () => {
        const versionNumber = "15.18.0";
        const expectedMajor = 15;
        const expectedMinor = 18;
        const expectedPatch = 0;

        const result = splitVersionNumber(versionNumber);

        expect(result).toBeDefined();
        expect(result.major).toBe(expectedMajor);
        expect(result.minor).toBe(expectedMinor);
        expect(result.patch).toBe(expectedPatch);
    });

    test('Given version number "15.18.0-RC12", should return split version number object with major equal to 15, minor equal to 18 and patch equal to 0', () => {
        const versionNumber = "15.18.0-RC12";
        const expectedMajor = 15;
        const expectedMinor = 18;
        const expectedPatch = 0;

        const result = splitVersionNumber(versionNumber);

        expect(result).toBeDefined();
        expect(result.major).toBe(expectedMajor);
        expect(result.minor).toBe(expectedMinor);
        expect(result.patch).toBe(expectedPatch);
    });

    test('Given version number "15.18", should return undefined', () => {
        const versionNumber = "15.18";

        expect(() => splitVersionNumber(versionNumber)).toThrow(new Error("Invalid version number format"));
    });

    test('Given version number "15.18.", should throw an error', () => {
        const versionNumber = "15.18.";

        expect(() => splitVersionNumber(versionNumber)).toThrow(new Error("Invalid version number format"));
    });

    test('Given version number "15.18.10.1", should throw an error', () => {
        const versionNumber = "15.18.10.1";

        expect(() => splitVersionNumber(versionNumber)).toThrow(new Error("Invalid version number format"));
    });
});

describe('cleanPatchVersionNumber', () => {
    test('Given patch version number "33", should return "33"', () => {
        const patchVersionNumber = "33";
        const expectedResult = "33";

        const result = cleanPatchVersionNumber(patchVersionNumber);

        expect(result).toBe(expectedResult);
    });

    test('Given patch version number "33-RC12", should return "33"', () => {
        const patchVersionNumber = "33-RC12";
        const expectedResult = "33";

        const result = cleanPatchVersionNumber(patchVersionNumber);

        expect(result).toBe(expectedResult);
    });
});