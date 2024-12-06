/**
 * A module which provides various logging utilities for the build scripts.
 *
 * @module
 */

//-- NPM
import chalk from 'npm:chalk';

/**
 * Whether verbose logging is enabled.
 */
let isVerboseEnabled = false;

/**
 * Reset whether verbose logging enabled.
 */
export function resetVerboseLoggingEnabled(): void {
    setVerboseLoggingEnabled(false);
}

/**
 * Set whether verbose logging is enabled.
 *
 * @param enabled - Whether to enable verbose logging. Defaults to `true`.
 */
export function setVerboseLoggingEnabled(enabled?: boolean): void {
    isVerboseEnabled = enabled ?? true;
}

/**
 * Get whether verbose logging is enabled.
 *
 * @return Whether verbose logging is enabled.
 */
export function getVerboseLoggingEnabled(): boolean {
    return isVerboseEnabled;
}

/**
 * Log some data at the verbose logging level.
 *
 * @param data The data to log.
 */
export function logVerbose(...data: unknown[]): void {
    if (getVerboseLoggingEnabled()) {
        console.debug(chalk.magentaBright('[VERBOSE]'), ...data);
    }
}

/**
 * Log some data at the informational logging level.
 *
 * @param data The data to log.
 */
export function logInfo(...data: unknown[]): void {
    console.info(chalk.cyanBright('[INFO]'), ...data);
}

/**
 * Log some data at the warning logging level.
 *
 * @param data The data to log.
 */
export function logWarning(...data: unknown[]): void {
    console.info(chalk.yellowBright('[WARN]'), ...data);
}

/**
 * Log some data at the error logging level.
 *
 * @param data The data to log.
 */
export function logError(...data: unknown[]): void {
    console.info(chalk.redBright('[ERROR]'), ...data);
}
