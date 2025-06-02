"use strict";

/** Routes for transactions. */
const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");

const Status = require("../models/status");

const statusNewSchema = require("../schemas/statusNew.json");
const statusUpdateSchema = require("../schemas/statusUpdate.json");

const router = new express.Router();

// * VW
// !NMW
/**  POST / CREATE { status } =>  { status }
 *
 * status should be { status } =>
 *
 * Returns { success : status.id }
 */
router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, statusNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route Error: POST / status => Validation Schema errors", errs);
        }

        const status = await Status.create(req.body);

        return res.status(201).json({ status });
    } catch (err) {
        return next(err);
    }
});
// * VW
// !NMW required: roleId >= ?
/** GET /  ALL    =>
 *   { status: [ {id, status }, ...] }
 */
router.get("/", async function (req, res, next) {
    try {
        const status = await Status.getAll();
        return res.json({ status });
    } catch (err) {
        return next(err);
    }
});
// * VW
// !NMW
/** GET /   statusId  =>
 *   { status: {id, status }, ...}
 *
 * Authorization: login
 */
router.get("/id/:id", async function (req, res, next) {
    try {
        const status = await Status.getById(req.params.id);
        return res.json({ status });
    } catch (err) {
        return next(err);
    }
});

// * VW
// !NMW => user.locationId === location.id?
/** GET /  BY  name { name }  =>
 *   { status: [ {status }, ...] }
 *
 */
router.get("/status/:status", async function (req, res, next) {
    try {
        const status = await Status.getByStatus(req.params.status);
        return res.json({ status });
    } catch (err) {
        return next(err);
    }
});

// * VW
// !NMW  Authorization required: user.roleId >=?
/** PATCH  /:id  =>  { id, name, regionId, address, city, state, zipCode, phone }
 *
 *  status is { id, status }
 *
 */
router.patch("/id/:id", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, statusUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route Error: PATCH => BASE_URL / status /:id=> Validation errors", errs);
        }
        // Check if the request body contains any valid fields to update
        if (Object.keys(req.body).length === 0) {
            throw new BadRequestError("Backend Error: No data provided to update");
        }
        const status = await Status.update(req.params.id, req.body);
        return res.json({ status });
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
router.delete("/:id", async function (req, res, next) {
    try {
        await Status.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
