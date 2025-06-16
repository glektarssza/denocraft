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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return super.cause;
        }
        return null;
    }

    public constructor(message?: string, opts?: BaseErrorOptions) {
        super(message, opts);
    }
}
