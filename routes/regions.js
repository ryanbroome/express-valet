"use strict";

/** Routes for transactions. */
const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");

const Region = require("../models/region");

const regionNewSchema = require("../schemas/regionNew.json");
const regionUpdateSchema = require("../schemas/regionUpdate.json");

const router = new express.Router();

// * VW
// !NMW roleId >= ?
/**  POST / CREATE { name } =>  { region }
 *
 * region should be {name} =>
 *
 * Returns { region: { id, name } }
 *
 */
router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, regionNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route Error: /regions => Validation Schema errors", errs);
        }

        const region = await Region.create(req.body);

        return res.status(201).json({ region });
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
        const regions = await Region.getAll();
        return res.json({ regions });
    } catch (err) {
        return next(err);
    }
});

// * VW
// !NMW
/** GET /   regionId  =>
 *   { regions: [ {id, name }, ...] }
 *
 * Authorization required: login
 * removed ensureLoggedIn
 * toggle ensureUserLocation
 */
router.get("/id/:id", async function (req, res, next) {
    try {
        const region = await Region.getById(req.params.id);
        return res.json({ region });
    } catch (err) {
        return next(err);
    }
});

// * VW
// !NMW => user.regionId === region.id?
/** GET /  BY  name { name }  =>
 *   { regions: [ {region }, ...] }
 *
 */
router.get("/name/:name", async function (req, res, next) {
    try {
        const regions = await Region.getByName(req.params.name);
        return res.json({ regions });
    } catch (err) {
        return next(err);
    }
});

// * VW
// !NMW  Authorization required: user.roleId >=?
/** PATCH  /:id  =>  { id, name }
 *
 *  region is { id, name }
 *
 */
router.patch("/id/:id", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, regionUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route Error: PATCH => /regions/id/:id => Validation errors", errs);
        }
        // Check if the request body contains any valid fields to update
        if (Object.keys(req.body).length === 0) {
            throw new BadRequestError("Backend Error: No data provided to update");
        }
        const region = await Region.update(req.params.id, req.body);
        return res.json({ region });
    } catch (err) {
        return next(err);
    }
});
//  *VW
// ! NMW => user.roleId >= ?
/** DELETE  /:id  =>  { deleted: id }
 *
 * Authorization: login
 */
router.delete("/id/:id", async function (req, res, next) {
    try {
        await Region.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
