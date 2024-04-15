"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Transaction = require("../models/transaction");
const Location = require("../models/location.js");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM vehicles");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM transactions");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM locations");

  Promise.all([
    await Location.create({
      sitename: "testLocation",
    }),
    await Vehicle.create({
      ticketNum: 1,
      vehicleStatus: "parked",
      mobile: "5551234567",
      color: "black",
      make: "honda",
      damages: "scratch",
      notes: "manual trans",
    }),
    await User.register({
      username: "U1",
      password: "password",
      firstName: "first",
      lastName: "last",
      email: "user1@user.com",
      phone: "555-123-4567",
      locationId: 1,
    }),
    await Transaction.create({
      userId: 1,
      vehicleId: 1,
      locationId: 1,
    }),
  ]);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  Promise.all([await db.query("ROLLBACK"), await db.query(`TRUNCATE vehicles RESTART IDENTITY CASCADE`)]);
  await db.end();
}

const u1Token = createToken({
  username: "U1",
  password: "password",
});
const testToken = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluVXNlciIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY5Njk2MzI5OX0.jXSjBR_BLkIpeYzosNz-cmTKfvopMNynadatC3BPgGo`;

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  testToken,
};
