"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for transactions. */

class Transaction {
  /** POST / Create a transaction (from data), update db, return new transaction data.
   *
   * data should be { user_id, vehicle_id, location_id }
   *
   * Returns { success : msg }
   *
   * Throws error if user or doesn't exist already in database.
   * */
  static async create({ userId, vehicleId, locationId }) {
    const duplicateCheck = await db.query(
      `SELECT 
          id,
          user_id AS "userId",
          vehicle_id AS "vehicleId",
          location_id AS "locationId"
       FROM 
          transactions
       WHERE 
          user_id = $1
       AND 
          vehicle_id = $2
        AND
          location_id = $3`,
      [userId, vehicleId, locationId]
    );

    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate transaction vehicle id: ${vehicleId} has already been parked by ${duplicateCheck.rows[0].userId}`);

    const result = await db.query(
      `INSERT INTO transactions 
          (user_id, vehicle_id, location_id) 
      VALUES 
          ($1, $2, $3)
      RETURNING
          id`,
      [userId, vehicleId, locationId]
    );

    const transaction = result.rows[0];

    return { success: `Successfully added transaction: ${transaction.id}` };
  }

  /** GET all transactions from database
   *
   * Returns { transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }
   *
   * Throws error if no transactions in database
   * */
  static async getAllDataByDateRange({ startYear, startMonth, startDay, endYear, endMonth, endDay }) {
    const query = `
  SELECT 
      t.id AS "transactionId",
      t.user_id AS "userId",
      t.vehicle_id AS "vehicleId",
      t.location_id AS "locationId",
      t.transaction_time AS "transactionTime",
      v.ticket_num AS "ticketNum",
      v.vehicle_status AS "vehicleStatus",
      v.check_in AS "checkIn",
      v.mobile AS "mobile",
      v.color AS "color",
      v.make AS "make",
      v.damages AS "damages",
      v.check_out AS "checkOut",
      v.notes AS "notes",
      l.sitename AS "sitename",
      u.first_name AS "firstName",
      u.last_name AS "lastName",
      u.phone AS "phone",
      u.email AS "email",
      u.total_parked AS "totalParked",
      u.is_admin AS "isAdmin"
  FROM 
      transactions t
  JOIN
      vehicles v
  ON
      t.vehicle_id = v.id
   JOIN
      users u
  ON
      t.user_id = u.id
  JOIN
      locations l
  ON
      t.location_id = l.id
  WHERE
      t.transaction_time >= $1 
  AND
     t.transaction_time <= $2`;

    const startDate = `${startYear}-${startMonth}-${startDay}`;
    const endDate = `${endYear}-${endMonth}-${endDay}`;

    const result = await db.query(query, [startDate, endDate]);

    const transactions = result.rows;

    if (!transactions) throw new NotFoundError(`No transactions available between ${startDate} and ${endDate}`);
    return transactions;
  }

  /** GET  transactions from database for a given location and a given status
   *
   * Returns { transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }
   *
   * Throws error if no transactions in database
   * */
  static async getAllByLocationStatus(locationId, status) {
    const query = `
  SELECT 
      t.id AS "transactionId",
      t.user_id AS "userId",
      t.vehicle_id AS "vehicleId",
      t.location_id AS "locationId",
      t.transaction_time AS "transactionTime",
      v.ticket_num AS "ticketNum",
      v.vehicle_status AS "vehicleStatus",
      v.check_in AS "checkIn",
      v.mobile AS "mobile",
      v.color AS "color",
      v.make AS "make",
      v.damages AS "damages",
      v.check_out AS "checkOut",
      v.notes AS "notes",
      l.sitename AS "sitename",
      u.first_name AS "firstName",
      u.last_name AS "lastName",
      u.phone AS "phone",
      u.email AS "email",
      u.total_parked AS "totalParked",
      u.is_admin AS "isAdmin"
  FROM 
      transactions t
  JOIN
      vehicles v
  ON
      t.vehicle_id = v.id
   JOIN
      users u
  ON
      t.user_id = u.id
  JOIN
      locations l
  ON
      t.location_id = l.id
  WHERE
  t.location_id = $1
  AND
  v.vehicle_status = $2
     `;

    const result = await db.query(query, [locationId, status]);

    const transactions = result.rows;

    if (!transactions) throw new NotFoundError(`No transactions available at location ${locationId}for status ${status}`);
    return transactions;
  }

  /** GET  transactions from database for a given location_id , user_id
   *
   * Returns { transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }
   *
   * Throws error if no transactions in database
   * */
  // *todo WOULD BE HELPFUL TO ADD STATUS argument?
  static async getAllByLocationUserId(locationId, userId) {
    const query = `
SELECT 
    t.id AS "transactionId",
    t.user_id AS "userId",
    t.vehicle_id AS "vehicleId",
    t.location_id AS "locationId",
    t.transaction_time AS "transactionTime",
    v.ticket_num AS "ticketNum",
    v.vehicle_status AS "vehicleStatus",
    v.check_in AS "checkIn",
    v.mobile AS "mobile",
    v.color AS "color",
    v.make AS "make",
    v.damages AS "damages",
    v.check_out AS "checkOut",
    v.notes AS "notes",
    l.sitename AS "sitename",
    u.first_name AS "firstName",
    u.last_name AS "lastName",
    u.phone AS "phone",
    u.email AS "email",
    u.total_parked AS "totalParked",
    u.is_admin AS "isAdmin"
FROM 
    transactions t
JOIN
    vehicles v
ON
    t.vehicle_id = v.id
 JOIN
    users u
ON
    t.user_id = u.id
JOIN
    locations l
ON
    t.location_id = l.id
WHERE
    l.id = $1
AND
    u.id = $2
AND
    v.vehicle_status = 'parked'
      `;

    const result = await db.query(query, [locationId, userId]);

    const transactions = result.rows;

    if (!transactions) throw new NotFoundError(`No transactions available at location ${locationId}for user ${userId}`);
    return transactions;
  }

  /** GET  transactions from database for a given location_id , user_id
   *
   * Returns { transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }
   *
   * Throws error if no transactions in database
   * */
  static async lostKeys(locationId, userId) {
    const query = `
SELECT 
    t.id AS "transactionId",
    t.user_id AS "userId",
    t.vehicle_id AS "vehicleId",
    t.location_id AS "locationId",
    t.transaction_time AS "transactionTime",
    v.ticket_num AS "ticketNum",
    v.vehicle_status AS "vehicleStatus",
    v.check_in AS "checkIn",
    v.mobile AS "mobile",
    v.color AS "color",
    v.make AS "make",
    v.damages AS "damages",
    v.check_out AS "checkOut",
    v.notes AS "notes",
    l.sitename AS "sitename",
    u.first_name AS "firstName",
    u.last_name AS "lastName",
    u.phone AS "phone",
    u.email AS "email",
    u.total_parked AS "totalParked",
    u.is_admin AS "isAdmin"
FROM 
    transactions t
JOIN
    vehicles v
ON
    t.vehicle_id = v.id
 JOIN
    users u
ON
    t.user_id = u.id
JOIN
    locations l
ON
    t.location_id = l.id
WHERE
    l.id = $1
AND
   u.id = $2
LIMIT 
  10
   `;

    const result = await db.query(query, [locationId, userId]);

    const transactions = result.rows;

    if (!transactions) throw new NotFoundError(`No transactions available at location ${locationId}for user ${userId}`);
    return transactions;
  }

  /**GET transactions from database for a given vehicle.mobile, return data about transactions matching partial, may want to try running this ONCHANGE rather than ONSUBMIT. Will it filter the list of vehicles?
   *
   * returns { ...allDataColsAllTables}
   *
   * Throws NotFoundError if not found
   */
  // *TODO HAVEN"T TESTED SINCE UPDATING LAST QUERY LINE v.vehicle_status = 'active'
  static async getByMobile(mobile) {
    const query = `
    SELECT 
        t.id AS "transactionId",
        t.user_id AS "userId",
        t.vehicle_id AS "vehicleId",
        t.location_id AS "locationId",
        t.transaction_time AS "transactionTime",
        v.ticket_num AS "ticketNum",
        v.vehicle_status AS "vehicleStatus",
        v.check_in AS "checkIn",
        v.mobile AS "mobile",
        v.color AS "color",
        v.make AS "make",
        v.damages AS "damages",
        v.check_out AS "checkOut",
        v.notes AS "notes",
        l.sitename AS "sitename",
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        u.phone AS "phone",
        u.email AS "email",
        u.total_parked AS "totalParked",
        u.is_admin AS "isAdmin"
    FROM 
        transactions t
    JOIN
        vehicles v
    ON
        t.vehicle_id = v.id
     JOIN
        users u
    ON
        t.user_id = u.id
    JOIN
        locations l
    ON
        t.location_id = l.id
    WHERE
        v.mobile ILIKE $1
    AND
        v.vehicle_status = 'active'
       `;

    const result = await db.query(query, [`%${mobile}%`]);

    const transactions = result.rows;

    if (!transactions) throw new NotFoundError(`No transactions available with mobile : ${mobile}`);
    return transactions;
  }

  /** GET transactions from database for a given transactionId, return data about transaction.
   *
   * Returns { id, user_id, vehicle_id, transaction_time}

   * Throws NotFoundError if not found.
   **/
  static async getById(id) {
    const transactionRes = await db.query(
      `  SELECT 
      t.id AS "transactionId",
      t.user_id AS "userId",
      t.vehicle_id AS "vehicleId",
      t.location_id AS "locationId",
      t.transaction_time AS "transactionTime",
      v.ticket_num AS "ticketNum",
      v.vehicle_status AS "vehicleStatus",
      v.check_in AS "checkIn",
      v.mobile AS "mobile",
      v.color AS "color",
      v.make AS "make",
      v.damages AS "damages",
      v.check_out AS "checkOut",
      v.notes AS "notes",
      l.sitename AS "sitename",
      u.first_name AS "firstName",
      u.last_name AS "lastName",
      u.phone AS "phone",
      u.email AS "email",
      u.total_parked AS "totalParked",
      u.is_admin AS "isAdmin"
  FROM 
      transactions t
  JOIN
      vehicles v
  ON
      t.vehicle_id = v.id
   JOIN
      users u
  ON
      t.user_id = u.id
  JOIN
      locations l
  ON
      t.location_id = l.id
  WHERE
  t.id = $1`,
      [id]
    );

    const transaction = transactionRes.rows[0];

    if (!transaction) throw new NotFoundError(`No transaction with ID : ${id}`);

    return transaction;
  }

  /** PATCH / Update  transaction data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: { user_id, vehicle_id }
   *
   * Returns { id, userId, vehicleId, transactionTime }
   *
   * Throws NotFoundError if not found.
   */
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      userId: "user_id",
      vehicleId: "vehicle_id",
    });

    const idVarIdx = "$" + (values.length + 1);

    const querySql = `
      UPDATE 
        transactions 
      SET ${setCols}
      WHERE id = ${idVarIdx} 
      RETURNING
        id, 
        user_id AS "userId",
        vehicle_id AS "vehicleId",
        transaction_time AS "transactionTime"
        `;

    const result = await db.query(querySql, [...values, id]);

    const transaction = result.rows[0];

    if (!transaction) throw new NotFoundError(`No transaction with ID: ${id}`);

    return transaction;
  }

  /** DELETE given transaction from database; returns undefined.
   *
   * Throws NotFoundError if transaction not found.
   *
   * Don't really want to be able to do this would be more of a VOID feature, where we would remove the transaction but the transaction log should stay complete and if it should be voided should just have the data updated to reflect that it was VOID rather than remove from Database. Future report or data analysis may depend on sequential transaction numbers.
   **/
  static async remove(id) {
    const result = await db.query(
      `DELETE
      FROM 
          transactions
      WHERE 
          id = $1
      RETURNING 
          id`,
      [id]
    );
    const transaction = result.rows[0];

    if (!transaction) throw new NotFoundError(`No transaction with ID: ${id}`);
  }
}
module.exports = Transaction;
