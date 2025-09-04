"AI GENERATED NEEDS REVIEW";

"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const UserRegion = require("../models/userRegion");
const userRegionNewSchema = require("../schemas/userRegionNew.json");

const router = new express.Router();

router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userRegionNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route Error: BASE_URL / userRegions => Validation Schema errors", errs);
        }
        const userRegion = await UserRegion.create(req.body);
        return res.status(201).json({ userRegion });
    } catch (err) {
        return next(err);
    }
});

router.get("/", async function (req, res, next) {
    try {
        const userRegion = await UserRegion.getAll();
        return res.json({ userRegion });
    } catch (err) {
        return next(err);
    }
});

router.get("/userId/:userId", async function (req, res, next) {
    try {
        const userRegions = await UserRegion.getAllByUserId({ userId: req.params.userId });
        const regionIds = userRegions.map((ur) => ur.regionId);
        return res.json({ userId: req.params.userId, regionIds });
    } catch (err) {
        return next(err);
    }
});

router.delete("/userId/:userId/regionId/:regionId", async function (req, res, next) {
    try {
        await UserRegion.remove({ userId: req.params.userId, regionId: req.params.regionId });
        return res.json({ deleted: req.params.regionId });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
