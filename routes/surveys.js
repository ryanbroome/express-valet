"use strict";

/** Routes for transactions. */
const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");

const Survey = require("../models/survey");

const surveyNewSchema = require("../schemas/surveyNew.json");
const surveyUpdateSchema = require("../schemas/surveyUpdate.json");

const router = new express.Router();

/**  POST / CREATE { survey } =>  { survey }
 *
 * survey should be {transactionId, q1Response, q2Response,  q3Response, q4Response, q5Response, q6Response, submittedAt} =>
 *
 * Returns { success : survey.id }
 *
 */
router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, surveyNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route Error: BASE_URL / surveys => Validation Schema errors", errs);
        }

        const survey = await Survey.create(req.body);

        return res.status(201).json({ survey });
    } catch (err) {
        return next(err);
    }
});

/** GET /  ALL    =>
 *   { surveys: [ {id, transactionId, q1Response, q2Response,  q3Response, q4Response, q5Response, q6Response, submittedAt }, ...] }
 *
 */
router.get("/", async function (req, res, next) {
    try {
        const surveys = await Survey.getAll();
        return res.json({ surveys });
    } catch (err) {
        return next(err);
    }
});

/** GET /   surveyId  =>
 *   { surveys: [ {id, transactionId, q1Response, q2Response,  q3Response, q4Response, q5Response, q6Response, submittedAt }, ...] }
 *
 * Authorization required: login
 * removed ensureLoggedIn
 * toggle ensureUserLocation
 */
router.get("/id/:id", async function (req, res, next) {
    try {
        const survey = await Survey.getById(req.params.id);
        return res.json({ survey });
    } catch (err) {
        return next(err);
    }
});

/** GET /   surveyId  =>
 *   { surveys: [ {id, transactionId, q1Response, q2Response,  q3Response, q4Response, q5Response, q6Response, submittedAt }, ...] }
 *
 * Authorization required: login
 * removed ensureLoggedIn
 * toggle ensureUserLocation
 */
router.get("/transactionId/:id", async function (req, res, next) {
    try {
        const survey = await Survey.getByTransactionId(req.params.id);
        return res.json({ survey });
    } catch (err) {
        return next(err);
    }
});

/** PATCH  /:id  =>  { id, name, regionId, address, city, state, zipCode, phone }
 *
 *  survey is { id, transactionId, q1Response, q2Response, q3Response, q4Response, q5Response, q6Response, submittedAt }
 *
 */
router.patch("/id/:id", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, surveyUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route Error: PATCH => BASE_URL / surveys /:id=> Validation errors", errs);
        }
        // Check if the request body contains any valid fields to update
        if (Object.keys(req.body).length === 0) {
            throw new BadRequestError("Backend Error: No data provided to update");
        }
        const survey = await Survey.update(req.params.id, req.body);
        return res.json({ survey });
    } catch (err) {
        return next(err);
    }
});

/** DELETE  /:id  =>  { deleted: id }
 *
 * Authorization: login
 */
router.delete("/id/:id", async function (req, res, next) {
    try {
        await Survey.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
