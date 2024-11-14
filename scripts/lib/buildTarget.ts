/**
 * A small library that provides build target-related utilities.
 *
 * @module
 */

//-- JSR
import * as path from 'jsr:@std/path';

/**
 * An enumeration of available build types.
 */
export enum BuildType {
    /**
     * The development build type.
     */
    Development = 'dev',

    /**
     * The release build type.
     */
    Release = 'release',
}

/**
 * An operating system that can be targeted for builds.
 */
export enum OperatingSystem {
    /**
     * The Linux operating system.
     */
    Linux = 'linux',

    /**
     * The Windows operating system.
     */
    Windows = 'win',

    /**
     * The macOS operating system.
     */
    MacOS = 'macos',
}

/**
 * A CPU architecture that can be targeted for builds.
 */
export enum CPUArchitecture {
    /**
     * The x64 CPU architecture.
     */
    X64 = 'x64',

    /**
     * The ARM64 CPU architecture.
     */
    AArch64 = 'aarch64',
}

/**
 * A type union of valid build targets.
 */
export type BuildTarget = Exclude<
    `${BuildType}-${OperatingSystem}-${CPUArchitecture}`,
    'dev-win-aarch64' | 'release-win-aarch64'
>;

/**
 * An array of valid build targets.
 */
export const VALID_BUILD_TARGETS: BuildTarget[] = [
    'dev-linux-x64',
    'dev-linux-aarch64',
    'dev-win-x64',
    'dev-macos-x64',
    'dev-macos-aarch64',
    'release-linux-x64',
    'release-linux-aarch64',
    'release-win-x64',
    'release-macos-x64',
    'release-macos-aarch64',
];

/**
 * Determines whether a string is a valid build target.
 *
 * @param target The string to check.
 *
 * @returns Whether the string is a valid build target.
 */
export function isValidBuildTarget(target: string): target is BuildTarget {
    return VALID_BUILD_TARGETS.includes(target as BuildTarget);
}

/**
 * Gets the build type of a build target.
 *
 * @param target The build target.
 *
 * @returns The build type of the build target.
 */
export function getBuildType(target: BuildTarget): BuildType {
    if (!isValidBuildTarget(target)) {
        throw new Error(`Invalid build target: ${target}`);
    }
    return target.split('-')[0] as BuildType;
}

/**
 * Gets the operating system of a build target.
 *
 * @param target The build target.
 *
 * @returns The operating system of the build target.
 */
export function getOperatingSystem(target: BuildTarget): OperatingSystem {
    if (!isValidBuildTarget(target)) {
        throw new Error(`Invalid build target: ${target}`);
    }
    return target.split('-')[1] as OperatingSystem;
}

/**
 * Gets the CPU architecture of a build target.
 *
 * @param target The build target.
 *
 * @returns The CPU architecture of the build target.
 */
export function getCPUArchitecture(target: BuildTarget): CPUArchitecture {
    if (!isValidBuildTarget(target)) {
        throw new Error(`Invalid build target: ${target}`);
    }
    return target.split('-')[2] as CPUArchitecture;
}

/**
 * Gets the build target for a given operating system and CPU architecture.
 *
 * @param buildType The build type.
 * @param operatingSystem The operating system.
 * @param cpuArchitecture The CPU architecture.
 *
 * @returns The build target for the operating system and CPU architecture.
 */
export function getBuildTarget(
    buildType: BuildType,
    operatingSystem: OperatingSystem,
    cpuArchitecture: CPUArchitecture,
): BuildTarget {
    return `${buildType}-${operatingSystem}-${cpuArchitecture}` as BuildTarget;
}

/**
 * Gets the default build targets for the project.
 *
 * @returns The default build targets.
 */
export function getDefaultBuildTargets(): BuildTarget[] {
    return [
        'release-linux-x64',
        'release-linux-aarch64',
        'release-win-x64',
        'release-macos-x64',
        'release-macos-aarch64',
    ];
}

/**
 * Get the path to the main module for the project.
 *
 * @param buildType The build type to get the main module path for.
 *
 * @returns The path to the main module.
 */
export function getMainModulePath(
    buildType: BuildType = BuildType.Release,
): string {
    return path.join(
        // deno-lint-ignore no-non-null-assertion
        import.meta.dirname!,
        buildType === BuildType.Release
            ? '../../src/main.ts'
            : '../../src/dev.ts',
    );
}

/**
 * Get the output path for a build target.
 *
 * @param target The build target.
 *
 * @returns The output path for the build target.
 */
export function getOutputPath(target: BuildTarget): string {
    return path.join(
        // deno-lint-ignore no-non-null-assertion
        import.meta.dirname!,
        '../../dist',
        `${getOperatingSystem(target)}-${getCPUArchitecture(target)}`,
        getBuildType(target),
    );
}

/**
 * Maps a build target to a Deno compile target.
 *
 * @param target The build target to map.
 *
 * @returns The Deno compile target.
 */
export function mapToDenoTarget(target: BuildTarget): string {
    const buildOS = getOperatingSystem(target);
    const buildArch = getCPUArchitecture(target);
    let denoTriplet: string = '';
    switch (buildArch) {
        case CPUArchitecture.X64:
            denoTriplet += 'x86_64';
            break;
        case CPUArchitecture.AArch64:
            denoTriplet += 'aarch64';
            break;
    }
    switch (buildOS) {
        case OperatingSystem.Linux:
            denoTriplet += '-unknown-linux-gnu';
            break;
        case OperatingSystem.Windows:
            denoTriplet += '-pc-windows-msvc';
            break;
        case OperatingSystem.MacOS:
            denoTriplet += '-apple-darwin';
            break;
    }
    return denoTriplet;
}
