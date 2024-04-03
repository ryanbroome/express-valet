"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Transaction = require("../models/transaction");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM vehicles");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM transactions");

  Promise.all([
    await Vehicle.create({
      ticketNum: 1,
      vehicleStatus: "parked",
      mobile: "555-123-4567",
      color: "black",
      make: "honda",
      damages: "scratch",
      notes: "manual trans",
    }),
    await User.register({
      username: "u1",
      password: "password",
      firstName: "first",
      lastName: "last",
      email: "user1@user.com",
      phone: "555-123-4567",
    }),
    await Transaction.create({
      user_id: 1,
      vehicle_id: 1,
    }),
  ]);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}
// ?commonAfterAll()? what does this do? TRUNCATE? RESTART IDENTITY CASCADE
async function commonAfterAll() {
  Promise.all([await db.query("ROLLBACK"), await db.query(`TRUNCATE vehicles RESTART IDENTITY CASCADE`)]);
  await db.end();
}

const u1Token = createToken({
  username: "u1",
  isAdmin: false,
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
