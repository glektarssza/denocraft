import {BaseError} from './baseError.ts';

/**
 * An error type indicating an argument was invalid.
 */
export class ArgumentError extends BaseError {
    /**
     * The name of the argument that was invalid.
     */
    public readonly argumentName: string;

    /**
     * Create a new instance.
     *
     * @param argumentName - The name of the argument that was invalid.
     * @param message - An optional error message.
     * @param options - An optional set of options to use to create the new
     * instance.
     */
    public constructor(
        argumentName: string,
        message?: string,
        options?: ErrorOptions
    ) {
        super(message ?? `Invalid argument "${argumentName}"`, options);
        this.hasCustomMessage = (message ?? null) !== null;
        this.argumentName = argumentName;
    }

    /**
     * Get a string representation of this instance.
     *
     * @returns A string representation of this instance.
     */
    public override toString(): string {
        const extraStuff: string[] = [];
        if (this.hasCustomMessage) {
            extraStuff.push(` (argument name: ${this.argumentName})`);
        }
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        return `${super.toString()}${extraStuff.join('')}`;
    }
}
