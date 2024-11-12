//-- NPM
import chalk from 'npm:chalk';

/**
 * Whether verbose logging is enabled.
 */
let verbose: boolean = false;

export function setVerbose(value: boolean): void {
    verbose = value;
}

/**
 * Write a verbose logging message to the console if verbose logging is enabled.
 *
 * @param message The message to write.
 */
export function writeVerbose(message: string): void {
    if (verbose) {
        console.debug(chalk.magentaBright('[VERBOSE]', message));
    }
}

/**
 * Write an informational logging message to the console.
 *
 * @param message The message to write.
 */
export function writeInfo(message: string): void {
    console.info(chalk.cyanBright('[INFO]', message));
}

/**
 * Write an warning logging message to the console.
 *
 * @param message The message to write.
 */
export function writeWarning(message: string): void {
    console.info(chalk.yellowBright('[WARN]', message));
}

/**
 * Write an error logging message to the console.
 *
 * @param message The message to write.
 */
export function writeError(message: string): void {
    console.info(chalk.redBright('[ERROR]', message));
}
