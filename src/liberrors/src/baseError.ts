/**
 * A base error type.
 */
export class BaseError extends Error {
    /**
     * Whether this instance had a custom message set.
     */
    private _customMessage: boolean;

    /**
     * Whether this instance had a custom message set.
     */
    public get hasCustomMessage(): boolean {
        return this._customMessage;
    }
    protected set hasCustomMessage(value: boolean) {
        this._customMessage = value;
    }

    /**
     * Create a new instance.
     *
     * @param message - The custom error message to create the new instance
     * with.
     * @param options - The custom options to create the new instance with.
     */
    public constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
        if (this.constructor.name) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            this.name = this.constructor.name;
        } else {
            this.name = 'BaseError';
        }
        this._customMessage = (message ?? null) !== null;
    }
}
