"use strict";

/** Routes for userPodiums. */
const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
//// const { ensureLoggedIn } = require("../middleware/auth");

const UserPodium = require("../models/userPodium");
const userPodiumNewSchema = require("../schemas/userPodiumNew.json");

const router = new express.Router();

/**  POST / CREATE { userId, podiumId } =>  { userPodium }
 *
 * userPodium should be { userId, podiumId } =>
 *
 * Returns { userPodium }
 */
router.post("/", async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, userPodiumNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map((e) => e.stack);
            throw new BadRequestError("Backend Route Error: BASE_URL / userPodiums => Validation Schema errors", errs);
        }
        const userPodium = await UserPodium.create(req.body);
        return res.status(201).json({ userPodium });
    } catch (err) {
        return next(err);
    }
});

/** GET /  ALL    =>
 *   { userPodiums: [ {userId, podiumId }, ...] }
 */
router.get("/", async function (req, res, next) {
    try {
        const userPodium = await UserPodium.getAll();
        return res.json({ userPodium });
    } catch (err) {
        return next(err);
    }
});

/** GET / ALL byUserId/   userPodium  =>
 *
 *   { userId: <userId>, podiumIds: [ 1, 2, 5, 13, ...] }
 */
router.get("/userId/:userId", async function (req, res, next) {
    try {
        const userPodiums = await UserPodium.getAllByUserId({ userId: req.params.userId });
        const podiumIds = userPodiums.map((up) => up.podiumId);
        return res.json({ userId: req.params.userId, podiumIds });
    } catch (err) {
        return next(err);
    }
});

/** DELETE  /:id  =>  { deleted: id }
 *
 * Authorization: login
 */
router.delete("/userId/:userId/podiumId/:podiumId", async function (req, res, next) {
    try {
        await UserPodium.remove({ userId: req.params.userId, podiumId: req.params.podiumId });
        return res.json({ deleted: req.params.podiumId });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
