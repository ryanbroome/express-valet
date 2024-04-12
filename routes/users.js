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

/** POST /  { user }  => { user, token }
 *
 * Adds a new user. This is not the registration endpoint --- instead, this is
 * only for admin users to add new users. The new user being added can be an
 * admin.
 *
 * This returns the newly created user and an authentication token for them:
 *  {user: { username, firstName, lastName, email, phone, totalParked, isAdmin }, token }
 *
 * Authorization required: login && admin
 **/
router.post(
  "/",
  // ensureLoggedIn, ensureAdmin,
  async function (req, res, next) {
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
  }
);

/** GET /  ALL => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of ALL USERS, ALL DATA.
 *
 *! Authorization required: login && admin=> {}
 **/
// todo update middleware token should be in request header when making requests
router.get(
  "/",
  /**ensureLoggedIn, ensureAdmin,*/
  async function (req, res, next) {
    try {
      const users = await User.findAll();
      return res.json({ users });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET / :username => { user }
 *
 * Returns { username, firstName, lastName, email, phone, totalParked, isAdmin }
 *
 * !Authorization required: login
 **/
router.get(
  "/:username",
  // ensureLoggedIn, loggedInUserOrAdmin,
  async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH / :username { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, email, phone, totalParked, isAdmin, locationId }
 *
 * Returns { username, firstName, lastName, email, phone, totalParked, isAdmin, locationId }
 *
 * Authorization required: login && same user || admin
 **/
router.patch(
  "/:username",
  //  ensureLoggedIn, loggedInUserOrAdmin,
  async function (req, res, next) {
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
  }
);

/** PATCH / /parkOne/:username { user } => { user }
 *
 *
 * Returns { username, firstName, lastName, email, phone, totalParked, isAdmin, locationId }
 *
 * Authorization required: login && same user || admin
 **/

router.patch(
  "/parkOne/:username",
  //  ensureLoggedIn, loggedInUserOrAdmin,
  async function (req, res, next) {
    try {
      const user = await User.incrementParked(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /:username  =>  { deleted: username }
 *
 * Authorization required: login
 **/
router.delete(
  "/:username",
  // ensureLoggedIn, loggedInUserOrAdmin,
  async function (req, res, next) {
    try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /:id  =>  { deleted: ID }
 *
 * Authorization required: login
 **/
router.delete(
  "remove/:id",
  // ensureLoggedIn, loggedInUserOrAdmin,
  async function (req, res, next) {
    try {
      await User.removeById(req.params.id);
      return res.json({ deleted: req.params.id });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
