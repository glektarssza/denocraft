import {ArgumentError} from './argumentError.ts';

/**
 * An error type indicating an argument was invalid because it was `null` or
 * `undefined`.
 */
export class ArgumentNullOrUndefinedError extends ArgumentError {
    /**
     * Create a new instance.
     *
     * @param argumentName - The name of the argument that was `null` or
     * `undefined`.
     * @param message - An optional error message.
     * @param options - An optional set of options to use to create the new
     * instance.
     */
    public constructor(
        argumentName: string,
        message?: string,
        options?: ErrorOptions
    ) {
        super(
            argumentName,
            message ?? `Invalid argument "${argumentName}" (null or undefined)`,
            options
        );
        this.hasCustomMessage = (message ?? null) !== null;
    }
}
