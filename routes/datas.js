"use strict";

/** Routes for transactions. */
const jsonschema = require("jsonschema");
const express = require("express");
const Data = require("../models/data");
const router = new express.Router();

/** GET today's transactions for a single podium
 	{
	    	"id": 16,
			"userId": 2,
			"vehicleId": 27,
			"podiumId": 1,
			"locationId": 1,
			"statusId": 1,
			"transactionTime": "2025-09-16T17:37:31.939Z",
			"updatedAt": "2025-09-16T17:37:31.939Z"
		}
*/
router.get("/garageData/today/podium/:podiumId", async function (req, res, next) {
    try {
        const userTimeZone = req.query.timezone || "UTC";
        const garageData = await Data.getTodayTransactionsByPodiumId(req.params.podiumId, userTimeZone);
        return res.json({ garageData });
    } catch (err) {
        return next(err);
    }
});

// GET today's transactions for a single location
router.get("/garageData/today/location/:locationId", async function (req, res, next) {
    try {
        const userTimeZone = req.query.timezone || "UTC";
        const garageData = await Data.getTodayTransactionsByLocationId(req.params.locationId, userTimeZone);
        return res.json({ garageData });
    } catch (err) {
        return next(err);
    }
});

// Get today's transactions for multiple podiums (POST for array)
router.post("/garageData/today/podiums", async function (req, res, next) {
    try {
        const { podiumIds, timezone } = req.body;
        if (!Array.isArray(podiumIds) || !timezone) {
            throw new BadRequestError("Missing podiumIds array or timezone string");
        }
        const garageData = await Data.getTodayTransactionsByPodiumIds(podiumIds, timezone);
        return res.json({ garageData });
    } catch (err) {
        return next(err);
    }
});

// Get today's transactions for multiple locations (POST for array)
router.get("/garageData/today/locations", async function (req, res, next) {
    try {
        const { locationIds, userTimeZone } = req.body;
        if (!Array.isArray(locationIds) || !userTimeZone) {
            throw new BadRequestError("Missing locationIds array or userTimeZone string");
        }
        const garageData = await Data.getTodayTransactionsByLocationIds(locationIds, userTimeZone);
        return res.json({ garageData });
    } catch (err) {
        return next(err);
    }
});

/** GET  all data for all time for a single podium
 */
router.get("/garageData/:podiumId", async function (req, res, next) {
    try {
        const garageData = await Data.getAllByPodiumId(req.params.podiumId);
        return res.json({ garageData });
    } catch (err) {
        return next(err);
    }
});

/** GET a single transaction detail by transaction ID */
router.get("/transactionDetail/:id/", async function (req, res, next) {
    try {
        const transactionDetail = await Data.getTransactionDetailsById(req.params.id);
        return res.json({ transactionDetail });
    } catch (err) {
        return next(err);
    }
});

/** GET list of podiums for a single location ID */
router.get("/podiums/locationId/:id/", async function (req, res, next) {
    try {
        const podiums = await Data.getPodiumsByLocationId(req.params.id);
        return res.json({ podiums });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
