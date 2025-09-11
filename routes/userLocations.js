"AI GENERATED NEEDS REVIEW ";

"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const UserLocation = require("../models/userLocation");
const userLocationNewSchema = require("../schemas/userLocationNew.json");

const router = new express.Router();

router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userLocationNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route Error: BASE_URL / userLocations => Validation Schema errors", errs);
        }
        const userLocation = await UserLocation.create(req.body);
        return res.status(201).json({ userLocation });
    } catch (err) {
        return next(err);
    }
});

router.get("/", async function (req, res, next) {
    try {
        const userLocation = await UserLocation.getAll();
        return res.json({ userLocation });
    } catch (err) {
        return next(err);
    }
});

router.get("/userId/:userId", async function (req, res, next) {
    try {
        const userLocations = await UserLocation.getAllByUserId({ userId: req.params.userId });
        const locationIds = userLocations.map((ul) => ul.locationId);
        return res.json(userLocations);
    } catch (err) {
        return next(err);
    }
});

router.delete("/userId/:userId/locationId/:locationId", async function (req, res, next) {
    try {
        await UserLocation.remove({ userId: req.params.userId, locationId: req.params.locationId });
        return res.json({ deleted: req.params.locationId });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
