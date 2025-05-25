"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }
        return next();
    } catch (err) {
        return next();
    }
}

// ** Middleware to use when they must be logged in with a roleId >= minRoleId
function ensureRoleAtLeast(minRoleId) {
    return function (req, res, next) {
        try {
            if (!res.locals.user || res.locals.user.roleId < minRoleId) {
                throw new UnauthorizedError("Backend: Must be logged in with roleId >= " + minRoleId);
            }
            return next();
        } catch (err) {
            return next(err);
        }
    };
}

// ** Middleware to use when they must be logged in with a roleId
function ensureRole(roleId) {
    return function (req, res, next) {
        try {
            if (!res.locals.user || res.locals.user.roleId !== roleId) {
                throw new UnauthorizedError("Backend: Must be logged in with roleId = " + roleId);
            }
            return next();
        } catch (err) {
            return next(err);
        }
    };
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
}

/** Middleware to use when user must be is_admin.
 *
 * If not, raises Unauthorized.
 */

function ensureAdmin(req, res, next) {
    try {
        if (res.locals.user.isAdmin !== true) {
            throw new UnauthorizedError("Must be an admin");
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

/** Middleware to use when user must be the same as creating user
 *
 * If not, raises Unauthorized.
 */

/** Middleware to use when users locationId must match the requested locationId
 *
 * If not, raises Unauthorized.
 */
function ensureUserLocation(req, res, next) {
    try {
        console.log("res.locals.user", res.locals.user, "req.params.id", req.params.id);
        if (res.locals.user.locationId === req.params.id) {
            return next();
        }
        throw new UnauthorizedError(`Backend: User locationId ${res.locals.user.locationId} does not match requested locationId ${req.params.id}`);
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureAdmin,
    ensureUserLocation,
};
