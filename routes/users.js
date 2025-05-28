"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn, ensureAdmin, loggedInUserOrAdmin } = require("../middleware/auth");
const { BadRequestError, NotFoundError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

//  * VW
//  ! NMW
/** POST /  { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to create new users. The new user being added can be various roles.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, phone, totalParked, roleId, podiumId }, token }
 *
 * Authorization required: login && admin
 **/
router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const user = await User.register(req.body);
        const token = createToken(user);

        return res.status(201).json({ user, token });
    } catch (err) {
        return next(err);
    }
});

//  * VW
// ! NMW
/** GET /  ALL => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of ALL USERS, ALL DATA.
 *
 **/
router.get("/", async function (req, res, next) {
    try {
        const users = await User.findAll();
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});

// ! NMW ensure user.username = req.params.username, or roleId >= ?
/** GET /username/:username => { user }
 *
 * Returns { username, firstName, lastName, email, phone, totalParked, isAdmin }
 *
 **/
router.get("/username/:username", async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

// ! NMW ensure user.id = req.params.id, or roleId >= ?
/** GET /id/ :id => { user }
 *
 * Returns { username, firstName, lastName, email, phone, totalParked, isAdmin }
 *
 **/
router.get("/id/:id", async function (req, res, next) {
    try {
        const user = await User.getById(req.params.id);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

//  ! NMW Logged in user or roleId >= ?
/** PATCH / :username { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, email, phone, totalParked, isAdmin, locationId }
 *
 * Returns { username, firstName, lastName, email, phone, totalParked, isAdmin, locationId }
 *
 * Authorization required: login && same user || admin
 **/
router.patch("/:username", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema);

        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const user = await User.update(req.params.username, req.body);

        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

//  ! NMW Logged in user or roleId >= ?
/** PATCH / /parkOne/:username { user } => { user }
 *
 *
 * Returns { username, firstName, lastName, email, phone, totalParked, isAdmin, locationId }
 *
 * Authorization required: login && same user || admin
 **/
router.patch("/parkOne/:username", async function (req, res, next) {
    try {
        const user = await User.incrementParked(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

//  ! NMW current user or roleId >= ?
/** DELETE /:username  =>  { deleted: username }
 *
 * Authorization required: login
 **/
router.delete("/:username", async function (req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.json({ deleted: req.params.username });
    } catch (err) {
        return next(err);
    }
});

//  ! NMW current user or roleId >= ?
/** DELETE /:id  =>  { deleted: ID }
 *
 * Authorization required: login
 **/
router.delete("/remove/:id", async function (req, res, next) {
    try {
        await User.removeById(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
