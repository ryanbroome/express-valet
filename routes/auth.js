"use strict";
/** Routes for authentication. */
const jsonschema = require("jsonschema");
const express = require("express");

const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError, ExpressError } = require("../expressError");

const router = new express.Router();

/** POST /auth/token:  { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 */
router.post("/token", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userAuthSchema);

        if (!validator.valid) {
            throw new BadRequestError(
                "Validation failed",
                validator.errors.map((e) => e.stack)
            );
        }

        const { username, password } = req.body;

        const user = await User.authenticate(username, password);
        const token = createToken(user);

        return res.json({ token });
    } catch (err) {
        console.log("Auth error", {
            status: err.status,
            message: err.message,
            errors: err.errors,
        });
        if (err instanceof ExpressError) {
            return res.status(err.status).json(err.formatResponse());
        }
        return next(err);
    }
});

/** POST /auth/register:   { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email, phone, roleId }
 *
 * Returns JWT token which can be used to authenticate further requests.
 * / TOKEN data includes all user data except password
 * Authorization required: none
 */
router.post("/register", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userRegisterSchema);

        if (!validator.valid) {
            throw new BadRequestError(
                "Backend BadRequestError: Validation failed",
                validator.errors.map((e) => e.stack)
            );
        }
        const newUser = await User.register({ ...req.body });
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        if (err instanceof ExpressError) {
            return res.status(err.status).json(err.formatResponse());
        }
        return next(err);
    }
});

module.exports = router;
