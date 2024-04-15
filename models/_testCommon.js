const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM vehicles");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await db.query(`
  INSERT INTO vehicles (ticket_num, vehicle_status, mobile, color, make, damages, notes)
  VALUES
      (1001, 'Parked', '123456789', 'Red', 'Toyota', 'Scratch on rear bumper', 'none'),
      (1002, 'Parked', '987654321', 'Blue', 'Honda', 'None', 'none'),
      (1003, 'Parked', '555555555', 'Black', 'Ford', 'Dented door', 'none')`);

  await db.query(
    `
    INSERT INTO users (
      username,
       password,
        first_name, 
        last_name,
         email,
         phone,
         total_parked,
          is_admin)
           VALUES  ('admin', $1, 'first', 'last', 'admin@gmail.com', '555-123-4567', 0, TRUE)
        RETURNING username`,
    [await bcrypt.hash("password1", BCRYPT_WORK_FACTOR)]
  );
  await db.query(
    `
    INSERT INTO users (
      username,
       password,
        first_name, 
        last_name,
         email,
         phone,
         total_parked,
          is_admin)
           VALUES ('user1', $1, 'first', 'last', 'test1@gmail.com', '555-123-4567', 0, FALSE)
        RETURNING username`,
    [await bcrypt.hash("password2", BCRYPT_WORK_FACTOR)]
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
