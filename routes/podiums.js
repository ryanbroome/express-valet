"use strict";

/** Routes for transactions. */
const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");

const Podium = require("../models/podium");

const podiumNewSchema = require("../schemas/podiumNew.json");
const podiumUpdateSchema = require("../schemas/podiumUpdate.json");

const router = new express.Router();
// * VW
// !NMW
/**  POST / CREATE { podium } =>  { podium }
 *
 * podium should be {name, locationId, isDeleted} =>
 *
 * Returns { success : podium.id }
 *
 */
router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, podiumNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route Error: BASE_URL / podiums => Validation Schema errors", errs);
        }

        const podium = await Podium.create(req.body);

        return res.status(201).json({ podium });
    } catch (err) {
        return next(err);
    }
});
// * VW
// !NMW user.roleId >= ?
/** GET /  ALL    =>
 *   { podiums: [ {id, name, locationId, isDeleted }, ...] }
 *
 */
router.get("/", async function (req, res, next) {
    try {
        const podiums = await Podium.getAll();
        return res.json({ podiums });
    } catch (err) {
        return next(err);
    }
});
// * VW
// !NMW
/** GET /   podium  =>
 *   { podiums: [ {id, name, locationId, isDeleted }, ...] }
 */
router.get("/id/:id", async function (req, res, next) {
    try {
        const podium = await Podium.getById(req.params.id);
        return res.json({ podium });
    } catch (err) {
        return next(err);
    }
});
//  * VW
// !NMW => user.podiumId === podium.id?
/** GET /  BY  name { name }  =>
 *   { podiums: [ {podium }, ...] }
 *
 */
router.get("/name/:name", async function (req, res, next) {
    try {
        const podiums = await Podium.getByName(req.params.name);
        return res.json({ podiums });
    } catch (err) {
        return next(err);
    }
});
// * VW
// !NMW  Authorization required: user.roleId >=?
/** PATCH  /:id  =>  { id, name, locationId, isDeleted }
 *
 *  podium is { id, name, locationId, isDeleted }
 *
 */
router.patch("/id/:id", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, podiumUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route PATCH => BASE_URL / podiums /id/:id=> Validation errors", errs);
        }
        // Check if the request body contains any valid fields to update
        if (Object.keys(req.body).length === 0) {
            throw new BadRequestError("Backend Error Podium.update: No data provided to update");
        }
        const podium = await Podium.update(req.params.id, req.body);
        return res.json({ podium });
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
        await Podium.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
