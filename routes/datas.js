"use strict";

/** Routes for transactions. */
const jsonschema = require("jsonschema");
const express = require("express");
const Data = require("../models/data");
const router = new express.Router();

// // const { BadRequestError } = require("../expressError");
// // const { ensureLoggedIn } = require("../middleware/auth");

/** GET /  ALL    =>>
 *   { garageData: [ {...data }, ...] }
 *
 * TODO Authorization required: roleId >= ?
 */
router.get("/garageData/:podiumId", async function (req, res, next) {
    try {
        const garageData = await Data.getAllByPodiumId(req.params.podiumId);
        return res.json({ garageData });
    } catch (err) {
        return next(err);
    }
});

/** GET /  ALL    =>>
 *   { garageData: [ {...data }, ...] }
 *
 * TODO Authorization required: roleId >= ?
 */
// Write query to get all podium data for today
router.get("/garageData/today", async function (req, res, next) {
    try {
        const garageData = await Data.getAllByPodiumId(req.params.podiumId);
        return res.json({ garageData });
    } catch (err) {
        return next(err);
    }
});

/** GET /  TransactionDetail Data By ID=>
 *   { data: {...transaction} }
 *
 */
router.get("/transactionDetail/id/:id/", async function (req, res, next) {
    try {
        const transaction = await Data.getTransactionDetailsById(req.params.id);
        return res.json({ data: transaction });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
