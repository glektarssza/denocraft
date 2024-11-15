/**
 * A small library that provides logging utilities.
 *
 * @module
 */

//-- NPM
import chalk from 'npm:chalk';

/**
 * An enumeration of available logging levels.
 */
export enum LoggingLevel {
    /**
     * The logging level for error messages.
     */
    Error = 'error',

    /**
     * The logging level for warning messages.
     */
    Warning = 'warning',

    /**
     * The logging level for informational messages.
     */
    Info = 'info',

    /**
     * The logging level for verbose messages.
     */
    Verbose = 'verbose',

    /**
     * The logging level for debugging messages.
     */
    Debug = 'debug',
}

/**
 * A function which can handle messages to be logged.
 *
 * @param message The message to be logged.
 * @param data Any additional data to be logged with the message.
 */
// deno-lint-ignore no-explicit-any
export type LoggingFunction = (message: string, ...data: any[]) => unknown;

/**
 * The functions being used to output messages.
 */
const loggingFunctions: Record<LoggingLevel, LoggingFunction> = {
    error: console.error,
    warning: console.warn,
    info: console.info,
    verbose: console.log,
    debug: console.debug,
};

/**
 * A function which can color messages to be logged.
 *
 * @param message The message to be colored.
 * @param data Any additional data to be colored with the message.
 *
 * @returns The colored message.
 */
// deno-lint-ignore no-explicit-any
export type LoggingColorFunction = (message: string, ...data: any[]) => string;

/**
 * The functions being used to color messages.
 */
const loggingColorFunctions: Record<
    LoggingLevel,
    LoggingColorFunction
> = {
    error: chalk.redBright,
    warning: chalk.yellowBright,
    info: chalk.cyanBright,
    verbose: chalk.magentaBright,
    debug: chalk.blueBright,
};

/**
 * Whether to output verbose logging messages.
 */
let doVerboseLogging: boolean = false;

/**
 * Get whether to output verbose logging messages.
 *
 * @returns Whether to output verbose logging messages.
 */
export function getOutputVerboseLogs(): boolean {
    return doVerboseLogging;
}

/**
 * Set whether to output verbose logging messages.
 *
 * @param value Whether to output verbose logging messages.
 */
export function setOutputVerboseLogs(value: boolean): void {
    doVerboseLogging = value;
}

/**
 * Reset whether to output verbose logging messages.
 */
export function resetOutputVerboseLogs(): void {
    setOutputVerboseLogs(false);
}

/**
 * Get the function to use for outputting a giving logging level.
 *
 * @param level The logging level to get the output function for.
 *
 * @returns The function to use as the output function.
 */
export function getOutputFunction(
    level: LoggingLevel,
): LoggingFunction {
    return loggingFunctions[level];
}

/**
 * Set the function to use for outputting a giving logging level.
 *
 * @param level The logging level to set the output function for.
 * @param func The function to set as the output function.
 */
export function setOutputFunction(
    level: LoggingLevel,
    func: LoggingFunction,
): void {
    loggingFunctions[level] = func;
}

/**
 * Reset the function to use for outputting a giving logging level.
 *
 * @param level The logging level to reset the output function for.
 */
export function resetOutputFunction(
    level: LoggingLevel,
): void {
    switch (level) {
        case LoggingLevel.Error:
            setOutputFunction(level, console.error);
            break;
        case LoggingLevel.Warning:
            setOutputFunction(level, console.warn);
            break;
        case LoggingLevel.Info:
            setOutputFunction(level, console.info);
            break;
        case LoggingLevel.Verbose:
            setOutputFunction(level, console.log);
            break;
        case LoggingLevel.Debug:
            setOutputFunction(level, console.debug);
            break;
    }
}

/**
 * Reset all the functions to use for outputting logging messages.
 */
export function resetAllOutputFunctions(): void {
    resetOutputFunction(LoggingLevel.Error);
    resetOutputFunction(LoggingLevel.Warning);
    resetOutputFunction(LoggingLevel.Info);
    resetOutputFunction(LoggingLevel.Verbose);
    resetOutputFunction(LoggingLevel.Debug);
}

/**
 * Get the function to use for coloring a giving logging level.
 *
 * @param level The logging level to get the color function for.
 *
 * @returns The function to use as the color function.
 */
export function getOutputColorFunction(
    level: LoggingLevel,
): LoggingColorFunction {
    return loggingColorFunctions[level];
}

/**
 * Set the function to use for coloring a giving logging level.
 *
 * @param level The logging level to set the color function for.
 * @param func The function to set as the color function.
 */
export function setOutputColorFunction(
    level: LoggingLevel,
    func: LoggingColorFunction,
): void {
    loggingColorFunctions[level] = func;
}

/**
 * Reset the function to use for coloring a giving logging level.
 *
 * @param level The logging level to reset the color function for.
 */
export function resetOutputColorFunction(
    level: LoggingLevel,
): void {
    switch (level) {
        case LoggingLevel.Error:
            setOutputColorFunction(level, chalk.redBright);
            break;
        case LoggingLevel.Warning:
            setOutputColorFunction(level, chalk.yellowBright);
            break;
        case LoggingLevel.Info:
            setOutputColorFunction(level, chalk.blueBright);
            break;
        case LoggingLevel.Verbose:
            setOutputColorFunction(level, chalk.magentaBright);
            break;
        case LoggingLevel.Debug:
            setOutputColorFunction(level, chalk.blueBright);
            break;
    }
}

/**
 * Reset all the functions to use for coloring logging messages.
 */
export function resetAllOutputColorFunctions(): void {
    resetOutputColorFunction(LoggingLevel.Error);
    resetOutputColorFunction(LoggingLevel.Warning);
    resetOutputColorFunction(LoggingLevel.Info);
    resetOutputColorFunction(LoggingLevel.Verbose);
    resetOutputColorFunction(LoggingLevel.Debug);
}

/**
 * Log a message to the console.
 *
 * @param level The logging level to output at.
 * @param message The message to output.
 */
export function log(
    level: LoggingLevel,
    message: string,
    ...data: unknown[]
): void {
    if (level === LoggingLevel.Verbose && !getOutputVerboseLogs()) {
        return;
    }
    getOutputFunction(level)(
        getOutputColorFunction(level)(
            `[${level.toUpperCase()}]`,
            message,
            ...data,
        ),
    );
}

/**
 * Log an error message to the console.
 *
 * @param message The message to output.
 * @param data Any additional data to output alongside the message.
 */
export function logError(message: string, ...data: unknown[]): void {
    log(LoggingLevel.Error, message, ...data);
}

/**
 * Log a warning message to the console.
 *
 * @param message The message to output.
 * @param data Any additional data to output alongside the message.
 */
export function logWarning(message: string, ...data: unknown[]): void {
    log(LoggingLevel.Warning, message, ...data);
}

/**
 * Log an informational message to the console.
 *
 * @param message The message to output.
 * @param data Any additional data to output alongside the message.
 */
export function logInfo(message: string, ...data: unknown[]): void {
    log(LoggingLevel.Info, message, ...data);
}

/**
 * Log a verbose message to the console.
 *
 * @param message The message to output.
 * @param data Any additional data to output alongside the message.
 */
export function logVerbose(message: string, ...data: unknown[]): void {
    log(LoggingLevel.Verbose, message, ...data);
}

/**
 * Log a debug message to the console.
 *
 * @param message The message to output.
 * @param data Any additional data to output alongside the message.
 */
export function logDebug(message: string, ...data: unknown[]): void {
    log(LoggingLevel.Debug, message, ...data);
}
