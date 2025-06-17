/**
 * Extended options for creating a new {@link BaseError}.
 */
export interface BaseErrorOptions extends ErrorOptions {
    /**
     * The error that caused the new {@link BaseError} instance to be created.
     */
    readonly cause?: Error;
}

/**
 * A base error class that other errors can extend from.
 */
export class BaseError extends Error {
    /**
     * The {@link Error} object that caused this instance to be created or `null`.
     */
    public override get cause(): Error | null {
        if (super.cause instanceof Error) {
            return super.cause;
        }
        return null;
    }

    /**
     * Create a new instance.
     *
     * @param message - The custom message to use to create the new instance.
     */
    public constructor(message?: string, opts?: BaseErrorOptions) {
        super(message, opts);
        this.name = 'BaseError';
    }
}
