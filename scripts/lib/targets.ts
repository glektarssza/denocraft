/**
 * A module which provides various build target related functionality for the
 * build scripts.
 *
 * @module
 */

/**
 * An enumeration of available operating systems that can be targeted for
 * builds.
 */
export enum OperatingSystem {
    Windows,
    Linux,
    MacOS,
}

/**
 * Try to parse an operating system from a string value.
 *
 * @param value - The string value to try to parse an operating system from.
 *
 * @returns The operating system that was parsed from the string on success;
 * `null` otherwise.
 */
export function tryParseOperatingSystem(value: string): OperatingSystem | null {
    switch (value.toLowerCase()) {
        case 'microsoft':
        case 'windows':
        case 'win32':
        case 'win':
            return OperatingSystem.Windows;
        case 'linux':
            return OperatingSystem.Linux;
        case 'darwin':
        case 'apple':
        case 'macos':
        case 'mac':
            return OperatingSystem.MacOS;
        default:
            return null;
    }
}

/**
 * Parse an operating system from a string value.
 *
 * @param value - The string value to parse an operating system from.
 *
 * @returns The operating system that was parsed from the string.
 *
 * @throws `Error`
 * Thrown if the string value cannot be parsed into a known operating system.
 */
export function parseOperatingSystem(value: string): OperatingSystem {
    const result = tryParseOperatingSystem(value);
    if (result === null) {
        throw new Error(`Unknown operating system: ${value}`);
    }
    return result;
}

/**
 * Try to get the current operating system.
 *
 * @returns The current operating system on success; `null` otherwise.
 */
export function tryGetCurrentOperatingSystem(): OperatingSystem | null {
    switch (Deno.build.os) {
        case 'windows':
            return OperatingSystem.Windows;
        case 'linux':
            return OperatingSystem.Linux;
        case 'darwin':
            return OperatingSystem.MacOS;
        default:
            return null;
    }
}

/**
 * Get the current operating system.
 *
 * @returns The current operating system.
 *
 * @throws `Error`
 * Thrown if the current operating system cannot be retrieved.
 */
export function getCurrentOperatingSystem(): OperatingSystem {
    const result = tryGetCurrentOperatingSystem();
    if (result === null) {
        throw new Error(`Unsupported operating system: ${result}`);
    }
    return result;
}

/**
 * An enumeration of available CPU architectures that can be targeted for
 * builds.
 */
export enum CPUArchitecture {
    x64,
    AArch64,
}

/**
 * Try to parse a CPU architecture from a string value.
 *
 * @param value - The string value to try to parse a CPU architecture from.
 *
 * @returns The CPU architecture that was parsed from the string on success;
 * `null` otherwise.
 */
export function tryParseCPUArchitecture(value: string): CPUArchitecture | null {
    switch (value.toLowerCase()) {
        case 'x86_64':
        case 'x64':
        case 'amd64':
            return CPUArchitecture.x64;
        case 'arm64':
        case 'aarch64':
            return CPUArchitecture.AArch64;
        default:
            return null;
    }
}

/**
 * Parse a CPU architecture from a string value.
 *
 * @param value - The string value to parse a CPU architecture from.
 *
 * @returns The CPU architecture that was parsed from the string.
 *
 * @throws `Error`
 * Thrown if the string value cannot be parsed into a known CPU architecture.
 */
export function parseCPUArchitecture(value: string): CPUArchitecture {
    const result = tryParseCPUArchitecture(value);
    if (result === null) {
        throw new Error(`Unknown CPU architecture: ${value}`);
    }
    return result;
}

/**
 * Try to get the current CPU architecture.
 *
 * @returns The current CPU architecture on success; `null` otherwise.
 */
export function tryGetCurrentCPUArchitecture(): CPUArchitecture | null {
    switch (Deno.build.arch) {
        case 'x86_64':
            return CPUArchitecture.x64;
        case 'aarch64':
            return CPUArchitecture.AArch64;
        default:
            return null;
    }
}

/**
 * Get the current CPU architecture.
 *
 * @returns The current CPU architecture.
 *
 * @throws `Error`
 * Thrown if the current CPU architecture cannot be retrieved.
 */
export function getCurrentCPUArchitecture(): CPUArchitecture {
    const result = tryGetCurrentCPUArchitecture();
    if (result === null) {
        throw new Error(`Unsupported CPU architecture: ${result}`);
    }
    return result;
}

/**
 * A set of parameters indicating what platform to build for.
 */
export interface BuildTarget {
    /**
     * The operating system being targeted.
     */
    os: OperatingSystem;

    /**
     * The CPU architecture being targeted.
     */
    cpu: CPUArchitecture;
}

/**
 * Try to map a {@link BuildTarget} to a supported Deno target triple.
 *
 * @param target - The build target to map.
 *
 * @returns The mapped Deno target triple on success; `null` otherwise.
 */
export function tryMapBuildTargetToDenoTarget(
    target: BuildTarget,
): string | null {
    if (
        target.os === OperatingSystem.Windows &&
        target.cpu === CPUArchitecture.AArch64
    ) {
        return null;
    }
    let denoTarget = '';
    switch (target.cpu) {
        case CPUArchitecture.x64:
            denoTarget += 'x86_64-';
            break;
        case CPUArchitecture.AArch64:
            denoTarget += 'aarch64-';
            break;
    }
    switch (target.os) {
        case OperatingSystem.Windows:
            denoTarget += 'pc-windows-msvc';
            break;
        case OperatingSystem.Linux:
            denoTarget += 'unknown-linux-gnu';
            break;
        case OperatingSystem.MacOS:
            denoTarget += 'apple-darwin';
            break;
    }
    return denoTarget;
}

/**
 * Map a {@link BuildTarget} to a Deno target triple.
 *
 * @param target - The build target to map.
 *
 * @returns The mapped Deno target triple.
 *
 * @throws `Error`
 * Thrown if the build target is not supported.
 */
export function mapBuildTargetToDenoTarget(target: BuildTarget): string {
    const result = tryMapBuildTargetToDenoTarget(target);
    if (result === null) {
        throw new Error(`Unsupported build target: ${JSON.stringify(target)}`);
    }
    return result;
}

/**
 * Get a list of supported build targets.
 *
 * @returns A list of supported build targets.
 */
export function getSupportedBuildTargets(): BuildTarget[] {
    return [
        {
            cpu: CPUArchitecture.AArch64,
            os: OperatingSystem.Linux,
        },
        {
            cpu: CPUArchitecture.AArch64,
            os: OperatingSystem.MacOS,
        },
        {
            cpu: CPUArchitecture.x64,
            os: OperatingSystem.Linux,
        },
        {
            cpu: CPUArchitecture.x64,
            os: OperatingSystem.MacOS,
        },
        {
            cpu: CPUArchitecture.x64,
            os: OperatingSystem.Windows,
        },
    ];
}
