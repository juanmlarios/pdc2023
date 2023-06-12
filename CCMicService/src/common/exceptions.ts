class BaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ConcurrencyError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}

export class AggregateNotFoundError extends BaseError {
    constructor(message: string) {
        super(message);

    }
}

export class ProjectionNotFoundError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}

export class TransientError extends BaseError {
    constructor(message: string) {
        super(message);
    }
}