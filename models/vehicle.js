"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, ExpressError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for vehicles. */

class Vehicle {
  /** POST Create a vehicle (from data), update db, return new vehicle data.
   *
   * data should be { ticketNum, status, mobile, color, make }
   *
   * Returns { ticketNum, status, mobile, color, make }
   *
   * Throws BadRequestError if vehicle mobile already in database.
   * */
  static async create({ ticketNum, vehicleStatus, mobile, color, make, damages, notes }) {
    const duplicateCheck = await db.query(
      `SELECT *
           FROM vehicles
           WHERE mobile = $1`,
      [mobile]
    );

    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate mobile: ${mobile}`);

    const result = await db.query(
      `INSERT INTO vehicles (ticket_num, vehicle_status, mobile, color, make, damages, notes)
        VALUES  ($1, $2, $3, $4, $5, $6, $7)
        RETURNING 
            ticket_num AS "ticketNum",
            vehicle_status AS "vehicleStatus",
            mobile,
            color,
            make,
            damages,
            notes
           `,
      [ticketNum, vehicleStatus, mobile, color, make, damages, notes]
    );
    const vehicle = result.rows[0];

    return vehicle;
  }

  /** GET Find all vehicles.
   *
   * Returns [{ ticketNum, status, mobile, color, make }, ...]
   * */
  static async findAll() {
    const vehiclesRes = await db.query(
      `SELECT 
          id,
          ticket_num AS "ticketNum",
          check_in AS "checkIn",
          check_out AS "checkOut",
          vehicle_status AS "vehicleStatus",
          mobile,
          color,
          make,
          damages,
          notes
      FROM
        vehicles
      `
    );
    return vehiclesRes.rows;
  }
  /** GET Find vehicles by status**/
  static async getByStatus(status) {
    const vehicleRes = await db.query(
      `SELECT 
          id,
          ticket_num AS "ticketNum",
          check_in AS "checkIn",
          check_out AS "checkOut",
          vehicle_status AS "vehicleStatus",
          mobile,
          color,
          make,
          damages,
          notes
      FROM
          vehicles
      WHERE 
          vehicle_status = $1
    `,
      [status]
    );

    const vehicles = vehicleRes.rows;
    if (!vehicles) throw new NotFoundError(`No vehicles with status : ${status}`);
    return vehicles;
  }

  /** GET Given a vehicle partial mobile, return data about vehicle.
   *
   * Returns {}
   *
   * Throws NotFoundError if not found.
   **/
  static async getByMobile(mobile) {
    const vehicleRes = await db.query(
      `
SELECT
           id,
           ticket_num AS "ticketNum",
           check_in AS "checkIn",
           check_out AS "checkOut",
           vehicle_status AS "vehicleStatus",
           mobile,
           color,
           make,
          damages,
          notes
FROM
          vehicles
WHERE 
          mobile 
ILIKE 
          $1
AND 
          vehicle_status = 'parked'
          `,
      [`%${mobile}%`]
    );

    const vehicle = vehicleRes.rows;

    if (!vehicle) throw new NotFoundError(`No vehicle with: ${mobile}`);

    return vehicle;
  }

  /** PATCH Update vehicle data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {vehicleStatus, checkOut, ticketNum... }
   *
   * Returns {*}
   *
   * Throws NotFoundError if not found.
   */
  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      vehicleStatus: "vehicle_status",
      ticketNum: "ticket_num",
      checkOut: "check_out",
    });

    const handleVarIdx = "$" + (values.length + 1);
    // checkout should be current timestamp, need to figure out how to make checkout a currentTimestamp
    const querySql = `UPDATE vehicles 
                      SET ${setCols} 
                      WHERE 
                            id = ${handleVarIdx} 
                      RETURNING 
                            id, 
                            ticket_num AS "ticketNum",
                            check_in AS "check_in",
                            check_out AS "check_out",
                            vehicle_status AS "vehicleStatus",
                            mobile,
                            color,
                            make,
                            damages, 
                            notes`;

    const result = await db.query(querySql, [...values, id]);
    const vehicle = result.rows[0];

    if (!vehicle) throw new NotFoundError(`No vehicle with id: ${id}`);

    return vehicle;
  }

  /** DELETE given vehicle from database; returns undefined.
   *
   * Throws NotFoundError if vehicle not found.
   **/
  static async remove(id) {
    const result = await db.query(
      `DELETE
        FROM 
            vehicles
        WHERE 
           id = $1
        RETURNING 
            id`,
      [id]
    );

    const vehicle = result.rows[0];

    if (!vehicle) throw new NotFoundError(`No vehicle with id: ${id}`);
  }
  i;
}

module.exports = Vehicle;
