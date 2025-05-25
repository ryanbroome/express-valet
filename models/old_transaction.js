"use strict";
const db = require("../db");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for data from multiple tables JOIN together. */

class Data {
    /** GET all transactions from database
     *
     * Returns { transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }
     *
     * Throws error if no transactions in database
     * */
    static async range({ startYear, startMonth, startDay, endYear, endMonth, endDay }) {
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

      v.id AS "vehicleId",
      v.ticket_num AS "ticketNum",
      v.status_id AS "statusId",
      v.mobile AS "mobile",
      v.color AS "color",
      v.make AS "make",
      v.damages AS "damages",
      v.notes AS "notes",

      p.id AS "podiumId",
      p.name AS "podiumName",
      p.location_id AS "podiumLocationId",

      l.id AS "locationId",
      l.name AS "locationName",
      l.region_id AS "regionId",
      l.address AS "locationAddress",
      l.city AS "locationCity",
      l.state AS "locationState",
      l.zip_code AS "locationZipCode",
      l.phone AS "locationPhone",

      u.id AS "userId",
      u.username AS "username",
      u.first_name AS "firstName",
      u.last_name AS "lastName",
      u.email AS "email",
      u.phone AS "phone",
      u.total_parked AS "totalParked",
      u.role_id AS "roleId",
      u.podium_id AS "podiumId"
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
 JOIN
      podiums p
  ON
      t.podium_id = p.id
  ORDER BY 
      t.transaction_time 
  WHERE
      t.transaction_time >= CURRENT_DATE - INTERVAL '1 DAY'
   AND
     t.transaction_time <= CURRENT_DATE
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
        t.transaction_time::DATE = CURRENT_DATE
 ORDER BY 
     t.transaction_time 
ASC`;

        const result = await db.query(query, [locationId]);

        const transactions = result.rows;

        if (!transactions.length) throw new NotFoundError(`Backend Error: No transactions available at locationId ${locationId} for today`);
        return transactions;
    }

    /** GET  transactions from database for a given location and a given status
     *
     * Returns { transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }
     *
     * Throws error if no transactions in database
     * */
    static async allByLocationStatus(locationId, status) {
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
  ORDER BY
     v.mobile 
  ASC`;

        const result = await db.query(query, [locationId, status]);

        const transactions = result.rows;

        if (!transactions) throw new NotFoundError(`Backend Error: No transactions available at location ${locationId} for status ${status}`);
        return transactions;
    }

    /** GET  transactions from database for a given location_id , user_id
     *
     * Returns { transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }
     *
     * Throws error if no transactions in database
     * */
    static async allByLocationUserId(locationId, userId) {
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

        if (!transactions) throw new NotFoundError(`Backend Error: No transactions available at location ${locationId} for user ${userId}`);
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
ORDER BY
    t.id 
DESC
LIMIT 
  5
   `;

        const result = await db.query(query, [locationId, userId]);

        const transactions = result.rows;

        if (!transactions) throw new NotFoundError(`Backend Error: No transactions available at location ${locationId} for user ${userId}`);
        return transactions;
    }

    /**GET transactions from database for a given vehicle.mobile, return data about transactions matching partial, may try ONCHANGE instead of ONSUBMIT?
     *
     * returns { ...allDataColsAllTables}
     *
     * Throws NotFoundError if not found
     */
    static async byLocationMobile(locationId, mobile) {
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
        v.vehicle_status = 'parked'
    AND 
        t.location_id = $2
    ORDER BY
        v.mobile
    ASC `;

        const result = await db.query(query, [`%${mobile}%`, locationId]);

        const transactions = result.rows;

        if (!transactions) throw new NotFoundError(`Backend Error: No transactions available with mobile : ${mobile}`);
        return transactions;
    }

    /** GET all transactions from database
     *
     * Returns [{ transId, userId, vehicleId, ticketNum, mobile, color, make, damages, valetFirst, valetLast }, ...]
     *
     * Throws error if no transactions in database
     * */
    static async getTodayData({ statusId = null, podiumId = null, locationId = null } = {}) {
        let whereClauses = [`t.transaction_time::DATE = CURRENT_DATE`];
        let values = [];
        let idx = 1;

        if (statusId !== null) {
            whereClauses.push(`v.status_id = $${idx++}`);
            values.push(statusId);
        }
        if (podiumId !== null) {
            whereClauses.push(`t.podium_id = $${idx++}`);
            values.push(podiumId);
        }
        if (locationId !== null) {
            whereClauses.push(`t.location_id = $${idx++}`);
            values.push(locationId);
        }

        const whereSql = whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : "";

        const query = `
    SELECT 
        t.id AS "transactionId",
        t.user_id AS "userId",
        t.vehicle_id AS "vehicleId",
        t.podium_id AS "podiumId",
        t.location_id AS "locationId",
        t.status_id AS "transactionStatusId",
        t.transaction_time AS "transactionTime",
        t.updated_at AS "updatedAt",

        v.id AS "vehicleId",
        v.ticket_num AS "ticketNum",
        v.status_id AS "vehicleStatusId",
        v.mobile AS "mobile",
        v.color AS "color",
        v.make AS "make",
        v.damages AS "damages",
        v.notes AS "notes",

        p.id AS "podiumId",
        p.name AS "podiumName",
        p.location_id AS "podiumLocationId",

        l.id AS "locationId",
        l.name AS "locationName",
        l.region_id AS "regionId",
        l.address AS "locationAddress",
        l.city AS "locationCity",
        l.state AS "locationState",
        l.zip_code AS "locationZipCode",
        l.phone AS "locationPhone",
    
        u.id AS "userId",
        u.username AS "username",
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        u.email AS "email",
        u.phone AS "phone",
        u.total_parked AS "totalParked",
        u.role_id AS "roleId",
        u.podium_id AS "userPodiumId"
    FROM 
        transactions t
    JOIN vehicles v ON t.vehicle_id = v.id
    JOIN users u ON t.user_id = u.id
    JOIN locations l ON t.location_id = l.id
    JOIN podiums p ON t.podium_id = p.id
    ${whereSql}
    ORDER BY t.transaction_time ASC
    `;
        // make query more dynamic by adding where clauses based on the parameters passed in
        const result = await db.query(query, values);

        // Throw an error if no transactions are found
        if (!result.rows.length) throw new NotFoundError(`Backend Error: No transactions available for today with statusId: ${statusId}, podiumId: ${podiumId}, locationId: ${locationId}`);

        return result.rows;
    }
}
module.exports = Data;
