"use strict";
const db = require("../db");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for transactions. */

class Transaction {
    /** POST / Create a transaction (from data), update db, return new transaction data.
     *
     * data should be { userId, vehicleId, podiumId, locationId, statusId }
     *
     * Returns { success : msg }
     *
     * Throws error if user or doesn't exist already in database.
     * */
    static async create({ userId, vehicleId, podiumId, locationId, statusId }) {
        const duplicateCheck = await db.query(
            `SELECT 
          id,
          user_id AS "userId",
          vehicle_id AS "vehicleId",
          location_id AS "locationId",
          podium_id AS "podiumId",
          status_id AS "statusId"
       FROM 
          transactions
       WHERE 
          user_id = $1
       AND 
          vehicle_id = $2
        AND
          location_id = $3
        AND
          podium_id = $4
        AND
          status_id = $5`,
            [userId, vehicleId, locationId, podiumId, statusId]
        );

        if (duplicateCheck.rows[0]) throw new BadRequestError(`Backend Error: Duplicate transaction vehicle id: ${vehicleId} has already been updated by ${duplicateCheck.rows[0].userId}`);

        const result = await db.query(
            `INSERT INTO transactions 
                (user_id, vehicle_id, location_id, podium_id, status_id)
             VALUES 
                ($1, $2, $3, $4, $5)
            RETURNING
                id`,
            [userId, vehicleId, locationId, podiumId, statusId]
        );

        const transaction = result.rows[0];

        return { success: transaction.id };
    }

    /** GET all transactions from database
     *
     * Returns { transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }
     *
     * Throws error if no transactions in database
     * */
    static async getAll() {
        const query = `
  SELECT 
      t.id AS "transactionId",
      t.user_id AS "userId",
      t.vehicle_id AS "vehicleId",
      t.podium_id AS "podiumId",
      t.location_id AS "locationId",
      t.status_id AS "statusId",
      t.transaction_time AS "transactionTime",
      t.updated_at AS "updatedAt",
  FROM 
      transactions t
  ORDER BY 
      t.transaction_time 
   ASC`;

        const result = await db.query(query, []);

        const transactions = result.rows;

        if (!transactions) throw new NotFoundError(`Backend Error: No transactions available`);
        return transactions;
    }

    /** GET all transactions from database
     *
     * Returns { transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }
     *
     * Throws error if no transactions in database
     * */
    static async getAllRange({ startYear, startMonth, startDay, endYear, endMonth, endDay }) {
        const query = `
  SELECT 
      t.id AS "transactionId",
      t.user_id AS "userId",
      t.vehicle_id AS "vehicleId",
      t.podium_id AS "podiumId",
      t.location_id AS "locationId",
      t.status_id AS "statusId",
      t.transaction_time AS "transactionTime",
      t.updated_at AS "updatedAt",
  FROM 
      transactions t
  ORDER BY 
      t.transaction_time 
  WHERE
      t.transaction_time >= $1
   AND
     t.transaction_time <= $2
   ASC`;

        const startDate = `${startYear}-${startMonth}-${startDay}`;
        const endDate = `${endYear}-${endMonth}-${endDay}`;

        const result = await db.query(query, [startDate, endDate]);

        const transactions = result.rows;

        if (!transactions) throw new NotFoundError(`Backend Error: No transactions available between ${startDate} and ${endDate}`);
        return transactions;
    }

    /** GET all transactions from database
     *
     * Returns [{ transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }, ...]
     *
     * Throws error if no transactions in database
     * */
    static async getTodayByLocation({ locationId }) {
        const query = `
       SELECT 
       t.id AS "transactionId",
       t.user_id AS "userId",
       t.vehicle_id AS "vehicleId",
       t.location_id AS "locationId",
       t.transaction_time AS "transactionTime"
       FROM 
       transactions t
       WHERE
       t.location_id = $1
       AND
       t.transaction_time::DATE = CURRENT_DATE
       ORDER BY 
       t.transaction_time 
       ASC`;

        const result = await db.query(query, [locationId]);

        const transactions = result.rows;

        if (!transactions.length) throw new NotFoundError(`Backend Error: No transactions available at locationId ${locationId} for today`);
        return transactions;
    }

    /** GET  transactions from database for a given location and a given statusId
     *
     * Returns { transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }
     *
     * Throws error if no transactions in database
     * */
    static async getByLocationStatus(locationId, statusId) {
        const query = `
       SELECT 
       t.id AS "transactionId",
       t.user_id AS "userId",
       t.vehicle_id AS "vehicleId",
       t.location_id AS "locationId",
       t.transaction_time AS "transactionTime"
       FROM 
       transactions t
       WHERE
       t.location_id = $1
       AND
       t.status_id = $2
       ORDER BY
       t.transaction_time 
       ASC`;

        const result = await db.query(query, [locationId, statusId]);

        const transactions = result.rows;

        if (!transactions) throw new NotFoundError(`Backend Error: No transactions available at location ${locationId} for status ${statusId}`);
        return transactions;
    }

    /** GET  transactions from database for a given location_id , user_id
     *
     * Returns { transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }
     *
     * Throws error if no transactions in database
     * */
    static async getByLocationUser(locationId, userId) {
        const query = `
       SELECT 
       t.id AS "transactionId",
       t.user_id AS "userId",
       t.vehicle_id AS "vehicleId",
       t.location_id AS "locationId",
       t.transaction_time AS "transactionTime"
       FROM 
       transactions t
       WHERE
       t.location_id = $1
       AND
       t.user_id = $2
       `;

        const result = await db.query(query, [locationId, userId]);

        const transactions = result.rows;

        if (!transactions) throw new NotFoundError(`Backend Error: No transactions available at location ${locationId} for user ${userId}`);
        return transactions;
    }

    /** GET transaction by id from database
     *
     * Returns { id, user_id, vehicle_id, location_id, status_id, transaction_time, updated_at }
     *
     * Throws NotFoundError if not found.
     **/
    static async getById(id) {
        const transactionRes = await db.query(
            `  SELECT 
                 t.id AS "transactionId",
                 t.user_id AS "userId",
                 t.vehicle_id AS "vehicleId",
                 t.podium_id AS "podiumId",
                 t.location_id AS "locationId",
                 t.status_id AS "statusId",
                 t.transaction_time AS "transactionTime",
                 t.updated_at AS "updatedAt"
            FROM 
                 transactions t
            WHERE
                 t.id = $1`,
            [id]
        );

        const transactions = transactionRes.rows[0];

        if (!transactions) throw new NotFoundError(`Backend Error: No transaction with ID : ${id}`);

        return transactions;
    }

    /** PATCH / Update  transaction data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all the
     * fields; this only changes provided ones.
     *
     * Data can include: { user_id, vehicle_id, podium_id, location_id, status_id }
     *
     * Returns { id, userId, vehicleId, transactionTime, podiumId, locationId, statusId }
     *
     * Throws NotFoundError if not found.
     */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {
            userId: "user_id",
            vehicleId: "vehicle_id",
            podiumId: "podium_id",
            locationId: "location_id",
            statusId: "status_id",
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
        podium_id AS "podiumId",
        location_id AS "locationId",
        status_id AS "statusId",
        transaction_time AS "transactionTime",
        updated_at AS "updatedAt"
        `;

        const result = await db.query(querySql, [...values, id]);

        const transactions = result.rows[0];

        if (!transactions) throw new NotFoundError(`Backend Error: No transaction with ID: ${id}`);

        return transactions;
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
        const transactions = result.rows[0];

        if (!transactions) throw new NotFoundError(`Backend Error: No transaction with ID: ${id}`);
    }
}
module.exports = Transaction;
