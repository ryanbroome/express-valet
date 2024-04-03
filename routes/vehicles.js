"use strict";

/** Routes for vehicles. */
const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Vehicle = require("../models/vehicle");

const vehicleNewSchema = require("../schemas/vehicleNew.json");
const vehicleUpdateSchema = require("../schemas/vehicleUpdate.json");

const router = new express.Router();

/** POST / { vehicle } =>  { vehicle }
 *
 * vehicle should be { ticketNum, vehicleStatus, mobile, color, make, damages, notes }
 *
 * Returns { ticketNum, vehicleStatus, mobile, color, make, damages, notes }
 *
 * Authorization required: login
 */
// *todo middleware protect routes
router.post(
  "/",
  // ensureLoggedIn, ensureAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, vehicleNewSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const vehicle = await Vehicle.create(req.body);

      return res.status(201).json({ vehicle });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET / =>  { vehicles }
 *
 * Returns { [ { vehicle0 } , { vehicle1 } , { vehicle2 } , ... ] }
 *
 * Authorization required: login
 */
router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const vehicles = await Vehicle.findAll();
    return res.json({ vehicles });
  } catch (err) {
    return next(err);
  }
});

/** GET /:mobile  =>  { vehicle }
 *
 *  vehicle is { ticketNum, checkIn, checkOut, vehicleStatus, mobile, color, make, damages, notes }
 *
 * Authorization required: none
 */
router.get("/:mobile", async function (req, res, next) {
  try {
    const vehicles = await Vehicle.mobile(req.params.mobile);

    return res.json({ vehicles });
  } catch (err) {
    return next(err);
  }
});

/** PATCH / :id  => { vehicle }
 *
 * Patches vehicle data.
 *
 * fields can be: { ticketNum, checkOut, vehicleStatus, mobile, color, make, notes}
 *
 * Returns { updatedVehicle }
 *
 * Authorization required: login
 */
router.patch(
  "/:id",
  // ensureLoggedIn, ensureAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, vehicleUpdateSchema);

      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);

        throw new BadRequestError(errs);
      }

      const vehicle = await Vehicle.update(req.params.id, req.body);
      return res.json({ vehicle });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE / :id  =>  { deleted: msg }
 *
 * Authorization: login
 */
router.delete(
  "/:id",
  //  ensureLoggedIn, ensureAdmin,
  async function (req, res, next) {
    try {
      await Vehicle.remove(req.params.id);

      return res.json({ deleted: `Vehicle deleted with ID : ${req.params.id}` });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
