/** ExpressError extends normal JS error so we can
 *  add a status when we make an instance of it.
 *
 *  The error-handling middleware will return this.
 */
// '
class ExpressError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
        this.errors = Array.isArray(message) ? message : [message];
    }

    formatResponse() {
        return {
            error: {
                status: this.status,
                message: this.message,
                errors: this.errors,
            },
        };
    }
}

class NotFoundError extends ExpressError {
    constructor(message = "Resource not found, Not Found Error") {
        super(message, 404);
    }
}

class UnauthorizedError extends ExpressError {
    constructor(message = "Invalid credentials, Unauthorized Error") {
        super(message, 401);
    }
}

class BadRequestError extends ExpressError {
    constructor(message = "Invalid request, Bad Request Error", errors = []) {
        super(message, 400);
        this.errors = errors;
    }
}

class ForbiddenError extends ExpressError {
    constructor(message = "Access forbidden") {
        super(message, 403);
    }
}

module.exports = {
    ExpressError,
    NotFoundError,
    UnauthorizedError,
    BadRequestError,
    ForbiddenError,
};
