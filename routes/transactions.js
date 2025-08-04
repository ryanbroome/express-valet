"use strict";

/** Routes for transactions. */
const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Transaction = require("../models/transaction");

const transactionNewSchema = require("../schemas/transactionNew.json");
const transactionUpdateSchema = require("../schemas/transactionUpdate.json");

const router = new express.Router();

/** POST / { transaction } =>  { transaction }
 *
 * transaction should be {userId, vehicleId } =>
 *
 * Returns { success : msg }
 *
 *Authorization required: login?
 */
router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, transactionNewSchema);

        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }

        const transaction = await Transaction.create(req.body);
        return res.status(201).json({ transaction });
    } catch (err) {
        return next(err);
    }
});

/** GET /  All
 *   Returns all transactions in the database.
 *   Returns an object with a key "transactions" containing an array of transaction objects.
 *   Each transaction object contains all columns from the transactions table.
 *   { transactions: [ {...transaction}, ...] }
 */
router.get("/", async function (req, res, next) {
    try {
        const transactions = await Transaction.getAll();
        return res.json({ transactions });
    } catch (err) {
        return next(err);
    }
});

/** GET /  By ID=>
 *   { transaction: {...transaction} }
 *
 */
router.get("/id/:id/", async function (req, res, next) {
    try {
        const transaction = await Transaction.getById(req.params.id);
        return res.json({ transaction });
    } catch (err) {
        return next(err);
    }
});

/** PATCH /[id] { data } => { transaction }
 *
 * Patches transaction data.
 *
 * fields can be: { userId, vehicleId }
 *
 *Authorization required: login
 */
router.patch("/:id", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, transactionUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError(errs);
        }
        const transaction = await Transaction.update(req.params.id, req.body);
        return res.json({ transaction });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 */
router.delete("/:id", async function (req, res, next) {
    try {
        await Transaction.remove(req.params.id);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
