"use strict";

/** Routes for transactions. */
const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");

const Role = require("../models/role");

const roleNewSchema = require("../schemas/roleNew.json");
const roleUpdateSchema = require("../schemas/roleUpdate.json");

const router = new express.Router();

// !NMW
/**  POST / CREATE { role } =>  { role }
 *
 * role should be {name} =>
 *
 * Returns { role: { id, role, isDeleted } }
 *
 *?Authorization required: roleId >= ?
 */
router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, roleNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route Error: BASE_URL / roles => Validation Schema errors", errs);
        }

        const role = await Role.create(req.body);

        return res.status(201).json({ role });
    } catch (err) {
        return next(err);
    }
});

// !NMW roleId >= ?
/** GET /  ALL    =>
 *   { roles: [ {id, role, isDeleted }, ...] }
 *
 */
router.get("/", async function (req, res, next) {
    try {
        const roles = await Role.getAll();
        return res.json({ roles });
    } catch (err) {
        return next(err);
    }
});

// !NMW
/** GET /   roleId  =>
 *   { roles: [ {id, role }, ...] }
 *
 * Authorization required: login
 * removed ensureLoggedIn
 * toggle ensureUserLocation
 */
router.get("/id/:id", async function (req, res, next) {
    try {
        const role = await Role.getById(req.params.id);
        return res.json({ role });
    } catch (err) {
        return next(err);
    }
});

// !NMW => user.locationId === location.id?
/** GET /  BY  name { name }  =>
 *   { roles: [ {role }, ...] }
 *
 */
router.get("/name/:name", async function (req, res, next) {
    try {
        const roles = await Role.getByName(req.params.name);
        return res.json({ roles });
    } catch (err) {
        return next(err);
    }
});

// !NMW  Authorization required: user.roleId >=?
/** PATCH  /:id  =>  { }
 *
 *  role is { id, name, isDeleted }
 *
 */
router.patch("/id/:id", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, roleUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route Error: PATCH => BASE_URL / roles /:id=> Validation errors", errs);
        }
        // Check if the request body contains any valid fields to update
        if (Object.keys(req.body).length === 0) {
            throw new BadRequestError("Backend Error: No data provided to update");
        }
        const role = await Role.update(req.params.id, req.body);
        return res.json({ role });
    } catch (err) {
        return next(err);
    }
});

// ! NMW => user.roleId >= ?
/** DELETE  /:id  =>  { deleted: id }*/
router.delete("/id/:id", async function (req, res, next) {
    try {
        await Role.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
