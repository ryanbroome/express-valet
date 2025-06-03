"use strict";

/** Routes for transactions. */
const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");

const Data = require("../models/data");

// const locationNewSchema = require("../schemas/locationNew.json");
// const locationUpdateSchema = require("../schemas/locationUpdate.json");

const router = new express.Router();

// *VW
// !NMW
/**  POST / CREATE { location } =>  { location }
 *
 * location should be {name, regionId, address, city, state, zipCode, phone} =>
 *
 * Returns { success : location.id }
 *
 *?Authorization required: roleId >= ?
 */
router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, locationNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route Error: BASE_URL / locations => Validation Schema errors", errs);
        }

        const location = await Location.create(req.body);

        return res.status(201).json({ location });
    } catch (err) {
        return next(err);
    }
});

// * VW
// !NMW
/** GET /  ALL    =>
 *   { locations: [ {id, name, regionId, address, city, state, zipCode, phone }, ...] }
 *
 * TODO Authorization required: roleId >= ?
 */
router.get("/", async function (req, res, next) {
    try {
        const locations = await Location.getAll();
        return res.json({ locations });
    } catch (err) {
        return next(err);
    }
});

// * VW
// !NMW
/** GET /   locationId  =>
 *   { locations: [ {id, sitename }, ...] }
 *
 * Authorization required: login
 * removed ensureLoggedIn
 * toggle ensureUserLocation
 */
router.get("/id/:id", async function (req, res, next) {
    try {
        const location = await Location.getById(req.params.id);
        return res.json({ location });
    } catch (err) {
        return next(err);
    }
});

// *VW
// !NMW => user.locationId === location.id?
/** GET /  BY  name { name }  =>
 *   { locations: [ {location }, ...] }
 *
 */
router.get("/name/:name", async function (req, res, next) {
    try {
        const locations = await Location.getByName(req.params.name);
        return res.json({ locations });
    } catch (err) {
        return next(err);
    }
});

// *VW
// !NMW  Authorization required: user.roleId >=?
/** PATCH  /:id  =>  { id, name, regionId, address, city, state, zipCode, phone }
 *
 *  location is { id, name, regionId, address, city, state, zipCode, phone }
 *
 */
router.patch("/id/:id", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, locationUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route Error: PATCH => BASE_URL / locations /:id=> Validation errors", errs);
        }
        // Check if the request body contains any valid fields to update
        if (Object.keys(req.body).length === 0) {
            throw new BadRequestError("Backend Error: No data provided to update");
        }
        const location = await Location.update(req.params.id, req.body);
        return res.json({ location });
    } catch (err) {
        return next(err);
    }
});

// * VW
// ! NMW => user.roleId >= ?
/** DELETE  /:id  =>  { deleted: id }
 *
 * Authorization: login
 */
router.delete("/id/:id", async function (req, res, next) {
    try {
        await Location.remove(req.params.id);
        return res.json({ deleted: `Location soft deleted with ID : ${req.params.id}` });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
