"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for transactions. */

class Transaction {
  /** Create a transaction (from data), update db, return new transaction data.
   *
   * data should be { user_id, vehicle_id }
   *
   * Returns { transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }
   *
   * Throws error if user or doesn't exist already in database.
   * */
  // todo Look at adding Notes column from vehicles table
  static async create({ userId, vehicleId }) {
    const duplicateCheck = await db.query(
      `SELECT 
          id,
          user_id AS "userId",
          vehicle_id AS "vehicleId"
       FROM 
          transactions
       WHERE 
          user_id = $1
       AND 
          vehicle_id = $2`,
      [userId, vehicleId]
    );

    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate transaction vehicle id: ${vehicleId} has already been parked by ${duplicateCheck.rows[0].userId}`);

    const result = await db.query(
      `INSERT INTO transactions 
          (user_id, vehicle_id) 
      VALUES 
          ($1, $2)
      RETURNING
          id`,
      [userId, vehicleId]
    );

    const transaction = result.rows[0];

    return { success: `Successfully added ${transaction.id}` };
  }

  /** Get all transactions from database
   *
   * Returns { transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }
   *
   * Throws error if no transactions in database
   * */
  //todo look at adding Notes column from vehicles table
  static async getAll() {
    const result = await db.query(
      `SELECT
          t.id AS "transId",
          u.id AS "userId",
          v.id AS "vehicleId",
          ticket_num AS "ticketNum",
          mobile,
          color,
          make,
          damages,
          first_name AS "valetFirst",
          last_name AS "valetLast"
        FROM
          transactions t
        JOIN
          vehicles v
        ON
          t.vehicle_id = v.id
        JOIN
          users u
        ON
          t.user_id = u.id`
    );
    const transactions = result.rows;

    if (!transactions) throw new NotFoundError(`No transactions available`);
    return transactions;
  }

  /** Given a Transaction ID, return data about transaction.
   *
   * Returns { id, user_id, vehicle_id, transaction_time}

   * Throws NotFoundError if not found.
   **/
  static async get(id) {
    const transactionRes = await db.query(
      `SELECT
           t.id AS "transId",
           u.id AS "userId",
           v.id AS "vehicleId",
           ticket_num AS "ticketNum",
           mobile,
           color,
           make,
           damages,
           first_name AS "valetFirst",
           last_name AS "valetLast"
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
      WHERE
          t.id = $1`,
      [id]
    );

    const transaction = transactionRes.rows[0];

    if (!transaction) throw new NotFoundError(`No transaction with ID : ${id}`);

    return transaction;
  }

  /** Update transaction data with `data`.
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
      user_id: "userId",
      vehicle_id: "vehicleId",
    });

    const idVarIdx = "$" + (values.length + 1);

    const querySql = `
      UPDATE jobs 
      SET ${setCols}
      WHERE id = ${idVarIdx} 
      RETURNING
        id, 
        user_id AS "userId",
        vehicle_id AS "vehicleId",
        transaction_time AS "transactionTime`;

    const result = await db.query(querySql, [...values, id]);

    const transaction = result.rows[0];

    if (!transaction) throw new NotFoundError(`No transaction with ID: ${id}`);

    return transaction;
  }

  /** Delete given transaction from database; returns undefined.
   *
   * Throws NotFoundError if transaction not found.
   *
   * Don't really want to be able to do this would be more of a VOID feature, where we would remove the transaction but the transaction log should stay complete and if it should be voided should just have the data updated to reflect that it was VOID rather than remove from Database. Future report or data analysis may depend on sequential transaction numbers.
   **/
  static async remove(id) {
    const result = await db.query(
      `DELETE
        FROM 
            jobs
        WHERE 
            id = $1
        RETURNING 
            title`,
      [id]
    );
    const transaction = result.rows[0];

    if (!transaction) throw new NotFoundError(`No transaction with ID: ${id}`);
  }
}
module.exports = Transaction;
