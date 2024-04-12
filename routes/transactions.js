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
// *todo middleware
router.post(
  "/",
  // ensureLoggedIn, ensureAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, transactionNewSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const transactions = await Transaction.create(req.body);
      return res.status(201).json({ transactions });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /  ALL BY  locationId, STATUS =>
 *   { transactions: [ {...allTablesAllData }, ...] }
 *
 * TODO Authorization required: Admin
 */
router.get("/location/:locationId/status/:status", async function (req, res, next) {
  try {
    const transactions = await Transaction.getAllByLocationStatus(req.params.locationId, req.params.status);
    return res.json({ transactions });
  } catch (err) {
    return next(err);
  }
});

/** GET /  ALL BY  locationId, USERID =>
 *   { transactions: [ {...allTablesAllData }, ...] }
 *
 * TODO Authorization required: Admin
 */
router.get("/location/:locationId/user/:userId", async function (req, res, next) {
  try {
    const transactions = await Transaction.getAllByLocationUserId(req.params.locationId, req.params.userId);
    return res.json({ transactions });
  } catch (err) {
    return next(err);
  }
});

/** GET /  ALL BY  range {startYear, startMonth, startDay, endYear, endMonth, endDay } startDate, endDate  =>
 *   { transactions: [ {...allTablesAllData }, ...] }
 *
 * TODO Authorization required: Admin
 */
router.get("/range", async function (req, res, next) {
  try {
    const transactions = await Transaction.getAllDataByDateRange({ ...req.body });
    return res.json({ transactions });
  } catch (err) {
    return next(err);
  }
});

/** GET /:mobile  =>  { transaction }
 *
 *  transaction is { ...allColumnsAlDataTables }
 *
 * Authorization required: none
 */
router.get("/search/location/:locationId/mobile/:mobile", async function (req, res, next) {
  try {
    const transactions = await Transaction.getByMobile(req.params.locationId, req.params.mobile);
    console.log("BACKEND transactions.getByMobile(locationId, mobile)", transactions);
    return res.json({ transactions });
  } catch (err) {
    return next(err);
  }
});

/** GET /  LOST KEYS  locationId, USERID =>
 *   { transactions: [ {...allTablesAllData }, ...] }
 *
 * TODO Authorization required: Admin
 */
router.get("/lostKeys/:locationId/:userId", async function (req, res, next) {
  try {
    const transactions = await Transaction.lostKeys(req.params.locationId, req.params.userId);
    return res.json({ transactions });
  } catch (err) {
    return next(err);
  }
});

/** GET / :id  =>  { transaction }
 *  Transaction can be { transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, ValetLast }
 *
 */
router.get("/:id", async function (req, res, next) {
  try {
    const transactions = await Transaction.getById(req.params.id);
    return res.json({ transactions });
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
router.patch(
  "/:id",
  //  ensureLoggedIn, ensureAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, transactionUpdateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const transactions = await Transaction.update(req.params.id, req.body);
      return res.json({ transactions });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: login
 */
// *todo middleware
router.delete(
  "/:id",
  // ensureLoggedIn, ensureAdmin,
  async function (req, res, next) {
    try {
      await Transaction.remove(req.params.id);
      return res.json({ deleted: req.params.id });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
