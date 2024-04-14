"use strict";

/** Routes for transactions. */
const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin, ensureUserLocation } = require("../middleware/auth");
const Location = require("../models/location");

const locationNewSchema = require("../schemas/locationNew.json");
const locationUpdateSchema = require("../schemas/locationUpdate.json");

const router = new express.Router();

/** POST / CREATE { location } =>  { location }
 *
 * location should be {sitename} =>
 *
 * Returns { success : location.id }
 *
 *Authorization required: login?
 */
router.post("/", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, locationNewSchema);

    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    // ? sitename maybe in Location.create({sitename})
    const location = await Location.create(req.body);

    return res.status(201).json({ location });
  } catch (err) {
    return next(err);
  }
});

/** GET /  ALL BY   =>
 *   { locations: [ {id, sitename }, ...] }
 *
 * TODO Authorization required: Admin
 */
router.get("/", async function (req, res, next) {
  try {
    const locations = await Location.getAll();
    return res.json({ locations });
  } catch (err) {
    return next(err);
  }
});

/** GET /   locationId  =>
 *   { locations: [ {id, sitename }, ...] }
 *
 * Authorization required: login
 * removed ensureLoggedIn
/toggle ensureUserLocation
*/
router.get("/id/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const location = await Location.getById(req.params.id);
    return res.json({ location });
  } catch (err) {
    return next(err);
  }
});

/** GET /  BY  sitename { sitename }  =>
 *   { transactions: [ {...allTablesAllData }, ...] }
 *
 */
router.get("/sitename/:sitename", async function (req, res, next) {
  try {
    const locations = await Location.getBySitename(req.params.sitename);
    return res.json({ locations });
  } catch (err) {
    return next(err);
  }
});

/** PATCH  /:id  =>  { id, sitename }
 *
 *  location is { id, sitename }
 *
 * Authorization required: none
 */
router.patch("/:id", async function (req, res, next) {
  try {
    const location = await Location.update(req.params.id, req.body);
    return res.json({ location });
  } catch (err) {
    return next(err);
  }
});

/** DELETE  /:id  =>  { deleted: id }
 *
 * Authorization: login
 */
router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    await Location.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
