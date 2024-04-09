"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for locations. */

class Location {
  /** POST / Create a location  update db, return new location data.
   *
   * data should be { user_id, vehicle_id, location_id }
   *
   * Returns { success : msg }
   *
   * Throws error if user or doesn't exist already in database.
   * */
  static async create({ sitename }) {
    const duplicateCheck = await db.query(
      `SELECT 
            id,
            sitename
       FROM 
            locations
       WHERE 
            sitename  = $1`,
      [sitename]
    );

    if (duplicateCheck.rows[0]) throw new BadRequestError(`Duplicate location Alert : ${sitename} already exists`);

    const result = await db.query(
      `INSERT INTO locations 
         (sitename) 
      VALUES 
          ($1)
      RETURNING
          id`,
      [sitename]
    );

    const location = result.rows[0];

    return { success: location.id };
  }

  /** GET all locations from database
   *
   * Returns {id, sitename }
   *
   * Throws error if no locations in database
   * */
  static async getAll() {
    const query = `
        SELECT 
            id,
            sitename
        FROM
            locations`;

    const result = await db.query(query);

    const locations = result.rows;

    if (!locations) throw new NotFoundError(`No locations available`);
    return locations;
  }

  /** GET  location from database for a given id
   *
   * Returns { id, sitename }
   *
   * Throws error if no location in database
   * */
  static async getById(id) {
    const query = `
  SELECT 
        id,
        sitename
    FROM
        locations l
    WHERE
        l.id = $1
     `;

    const result = await db.query(query, [id]);

    const locations = result.rows;

    if (!locations) throw new NotFoundError(`No locations available with ID : ${id}`);
    return locations;
  }

  /** GET  locations from database for a given sitename
   *    works with partial name anywhere in the sitename
   * Returns { id, sitename }
   *
   * Throws error if no locations in database
   * */
  static async getBySitename(sitename) {
    const query = `
SELECT
    id,
    sitename
FROM
    locations l
WHERE
    l.sitename ILIKE $1
   `;

    const result = await db.query(query, [`%${sitename}%`]);

    const locations = result.rows;

    if (!locations) throw new NotFoundError(`No locations available including sitename :  ${sitename}`);
    return locations;
  }

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
    const { setCols, values } = sqlForPartialUpdate(data, {});

    const idVarIdx = "$" + (values.length + 1);

    const querySql = `
      UPDATE 
        locations 
      SET ${setCols}
      WHERE id = ${idVarIdx} 
      RETURNING
        id,
        sitename
        `;

    const result = await db.query(querySql, [...values, id]);

    const location = result.rows[0];

    if (!location) throw new NotFoundError(`No location with ID: ${id}`);

    return location;
  }

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

    if (!location) throw new NotFoundError(`No location with ID: ${id}`);
  }
}
module.exports = Location;
