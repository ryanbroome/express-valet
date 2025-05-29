"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for locations. */

class Location {
    static jsToSql = {
        regionId: "region_id",
        zipCode: "zip_code",
    };

    // * VW
    /** POST / Create a location  update db, return new location data.
     *
     * data should be { user_id, vehicle_id, location_id }
     *
     * Returns { success : id }
     *
     * Throws error if user or doesn't exist already in database.
     * */
    static async create({ name, regionId, address, city, state, zipCode, phone }) {
        const duplicateCheck = await db.query(
            `SELECT 
            id,
            name
       FROM 
            locations
       WHERE 
            name  = $1`,
            [name]
        );

        if (duplicateCheck.rows[0]) throw new BadRequestError(`Backend Error Location.create Duplicate location Alert : ${name} already exists`);

        const result = await db.query(
            `INSERT INTO locations 
         (name, region_id, address, city, state, zip_code, phone) 
      VALUES 
          ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
          id`,
            [name, regionId, address, city, state, zipCode, phone]
        );

        const location = result.rows[0];

        return location;
    }

    // * VW
    /** GET all locations from database
     *
     * Returns {id, name, regionId, address, city, state, zipCode, phone }
     *
     * Throws error if no locations in database
     * */
    static async getAll() {
        const query = `
        SELECT 
            id,
            name,
            region_id AS "regionId",
            address,
            city,
            state,
            zip_code AS "zipCode",
            phone
        FROM
            locations`;

        const result = await db.query(query);

        const locations = result.rows;

        if (!locations) throw new NotFoundError(`Backend Error: No locations available`);
        return locations;
    }

    // * VW
    /** GET  location from database for a given id
     *
     * Returns { id, name, regionId, address, city, state, zipCode, phone }
     *
     * Throws error if no location in database
     * */
    static async getById(id) {
        const query = `
  SELECT 
        id,
        name,
        region_id AS "regionId",
        address,
        city,
        state,
        zip_code AS "zipCode",
        phone
    FROM
        locations l
    WHERE
        l.id = $1
     `;

        const result = await db.query(query, [id]);

        const location = result.rows[0];

        if (!location) throw new NotFoundError(`Backend Error Location.getById: No locations available with ID : ${id}`);
        return location;
    }
    // * VW
    /** GET  locations from database for a given name
     *    works with partial name anywhere in the name
     * Returns { id, name, regionId, address, city, state, zipCode, phone }
     *
     * Throws error if no locations in database
     * */
    static async getByName(name) {
        const query = `
SELECT
    id,
    name,
    region_id AS "regionId",
    address,
    city,
    state,
    zip_code AS "zipCode",
    phone
FROM
    locations l
WHERE
    l.name ILIKE $1
   `;

        const result = await db.query(query, [`%${name}%`]);

        const locations = result.rows[0];

        if (!locations) throw new NotFoundError(`Backend Error: No locations available including name :  ${name}`);
        return locations;
    }

    // *VW
    /** PATCH / Update  location data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all the
     * fields; this only changes provided ones.
     *
     * Data can include: { user_id, vehicle_id }
     *
     * Returns { id, userId, vehicleId, locationTime }
     *
     * Throws NotFoundError if not found.
     */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, Location.jsToSql);

        const idVarIdx = "$" + (values.length + 1);

        const querySql = `
      UPDATE 
        locations 
      SET ${setCols}
      WHERE id = ${idVarIdx} 
      RETURNING
        id,
        name,
        region_id AS "regionId",
        address,
        city,
        state,
        zip_code AS "zipCode",
        phone
        `;

        const result = await db.query(querySql, [...values, id]);

        const location = result.rows[0];

        if (!location) throw new NotFoundError(`Backend Error Location.update : No location with ID: ${id}`);

        return location;
    }
    // * VW
    /** DELETE given location by id from database; returns undefined.
     *
     * Throws NotFoundError if location not found.
     *
     * Don't really want to be able to do this would be more of a VOID feature, where we would remove the location but the location log should stay complete and if it should be voided should just have the data updated to reflect that it was VOID rather than remove from Database. Future report or data analysis may depend on sequential location numbers.
     **/
    static async remove(id) {
        const result = await db.query(
            `DELETE
      FROM 
          locations
      WHERE 
          id = $1
      RETURNING 
          id`,
            [id]
        );
        const location = result.rows[0];

        if (!location) throw new NotFoundError(`Backend Error: No location with ID: ${id}`);
    }
}
module.exports = Location;
