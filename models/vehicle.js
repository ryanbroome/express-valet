"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, ExpressError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for vehicles. */

class Vehicle {
    // Vehicle class is used to interact with the vehicles table in the database
    static jsToSql = {
        ticketNum: "ticket_num",
        statusId: "status_id",
    };

    //  * VW
    /** POST Create a vehicle (from data), update db, return new vehicle data.
     *
     * data should be { ticketNum, statusId, mobile, color, make, damages, notes }
     *
     * Returns { ticketNum, statusId, mobile, color, make, damages, notes }
     *
     * Throws BadRequestError if vehicle mobile already in database.
     * */
    static async create({ ticketNum, statusId, mobile, color, make, damages, notes }) {
        const duplicateCheck = await db.query(
            `SELECT *
           FROM vehicles
           WHERE mobile = $1`,
            [mobile]
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Backend Error: Duplicate vehicle mobile: ${mobile}`);
        }

        const result = await db.query(
            `INSERT INTO
                vehicles (ticket_num, status_id, mobile, color, make, damages, notes)
             VALUES  ($1, $2, $3, $4, $5, $6, $7)
             RETURNING
                 id,
                 ticket_num AS "ticketNum",
                 status_id AS "statusId",
                 mobile,
                 color,
                 make,
                 damages,
                 notes
           `,
            [ticketNum, statusId, mobile, color, make, damages, notes]
        );
        const vehicle = result.rows[0];

        return vehicle;
    }
    // * VW
    /** GET all vehicles.
     *
     * Returns [{ ticketNum, statusId, mobile, color, make, damages, notes }, ...]
     * */
    static async findAll() {
        try {
            const vehiclesRes = await db.query(
                `SELECT 
            id,
            ticket_num AS "ticketNum",
            status_id AS "statusId",
            mobile,
            color,
            make,
            damages,
            notes
        FROM
          vehicles
        `
            );
            if (vehiclesRes.rows.length === 0) {
                throw new NotFoundError("Backend Error Vehicle.findAll : No vehicles found");
            }
            return vehiclesRes.rows;
        } catch (err) {
            console.error("error occurred while getting all vehicles", err);
            throw err;
        }
    }
    // * VW
    /** GET vehicle by ID.
     *
     * Returns [{ ticketNum, statusId, mobile, color, make, damages, notes }, ...]
     * */
    static async getById(id) {
        const vehicleRes = await db.query(
            `SELECT 
          id,
          ticket_num AS "ticketNum",
          status_id AS "statusId",
          mobile,
          color,
          make,
          damages,
          notes
      FROM
          vehicles
      WHERE 
          id = $1`,
            [id]
        );

        const vehicle = vehicleRes.rows[0];

        if (!vehicle) throw new NotFoundError(`Backend Error: No vehicle with ID : ${id}`);
        return vehicle;
    }
    // * VW
    /** GET Find vehicles by status**/
    static async getByStatusId(statusId) {
        const vehicleRes = await db.query(
            `SELECT 
          id,
          ticket_num AS "ticketNum",
          status_id AS "statusId",
          mobile,
          color,
          make,
          damages,
          notes
      FROM
          vehicles
      WHERE 
          status_id = $1
    `,
            [statusId]
        );

        const vehicles = vehicleRes.rows;

        if (!vehicles.length) throw new NotFoundError(`Backend Error Vehicle.getByStatusId: No vehicles with status : ${statusId}`);

        return vehicles;
    }
    // * VW
    /** GET Given a vehicle partial mobile and statusId return data about vehicle.
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
           status_id AS "statusId",
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
          $1`,
            [`%${mobile}%`]
        );

        const vehicle = vehicleRes.rows;

        if (!vehicle.length) throw new NotFoundError(`Backend Error: No vehicle with: ${mobile}`);

        return vehicle;
    }
    // * VW
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
        const { setCols, values } = sqlForPartialUpdate(data, Vehicle.jsToSql);

        const handleVarIdx = "$" + (values.length + 1);
        // checkout should be current timestamp, need to figure out how to make checkout a currentTimestamp
        const querySql = `UPDATE vehicles 
                      SET ${setCols} 
                      WHERE 
                            id = ${handleVarIdx} 
                      RETURNING 
                            id, 
                            ticket_num AS "ticketNum",
                            status_id AS "statusId",
                            mobile,
                            color,
                            make,
                            damages, 
                            notes`;

        const result = await db.query(querySql, [...values, id]);
        const vehicle = result.rows[0];

        if (!vehicle) throw new NotFoundError(`Backend Error: No vehicle with id: ${id}`);

        return vehicle;
    }

    // * VW
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

        if (!vehicle) throw new NotFoundError(`Backend Error Vehicle.remove: No vehicle with id: ${id}`);
    }
}

module.exports = Vehicle;
