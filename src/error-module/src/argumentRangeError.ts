import {ArgumentError} from './argumentError.ts';

/**
 * An error type indicating an argument was invalid because it was outside the
 * allowed range.
 */
export class ArgumentRangeError<
    T extends {toString(): string}
> extends ArgumentError {
    public readonly minimumValue: T;

    public readonly maximumValue: T;

    /**
     * Create a new instance.
     *
     * @param argumentName - The name of the argument that was outside the
     * allowed range.
     * @param message - An optional error message.
     * @param options - An optional set of options to use to create the new
     * instance.
     */
    public constructor(
        argumentName: string,
        minimumValue: T,
        maximumValue: T,
        message?: string,
        options?: ErrorOptions
    ) {
        super(
            argumentName,
            message ??
                `Invalid argument "${argumentName}" (outside the allowed range of "${minimumValue.toString()}" to "${maximumValue.toString()}")`,
            options
        );
        this.minimumValue = minimumValue;
        this.maximumValue = maximumValue;
    }

    /**
     * Get a string representation of this instance.
     *
     * @returns A string representation of this instance.
     */
    public override toString(): string {
        const extraStuff: string[] = [];
        if (this.hasCustomMessage) {
            extraStuff.push(
                ` (maximum value: ${this.maximumValue.toString()})`
            );
            extraStuff.push(
                ` (minimum value: ${this.minimumValue.toString()})`
            );
        }
        return `${super.toString()}${extraStuff.join('')}`;
    }
}
