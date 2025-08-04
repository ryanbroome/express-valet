"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for podiums. */

class Podium {
    // To convert JavaScript variable names to SQL column names. This is used in the sqlForPartialUpdate function in models/podium.js
    static jsToSql = {
        locationId: "location_id",
        isDeleted: "is_deleted",
    };

    /** POST / Create a podium  update db, return new podium data.
     *
     * data should be {  name, locationId }
     *
     * Returns { success : id }
     *
     * Throws error if user or doesn't exist already in database.
     * */
    static async create({ name, locationId }) {
        // Check for duplicate podium at the same location
        const duplicateCheck = await db.query(`SELECT id FROM podiums WHERE name = $1 AND location_id = $2 AND is_deleted = FALSE`, [name, locationId]);

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Backend Error: Duplicate podium: ${name} already exists at location ID: ${locationId}`);
        }

        try {
            const result = await db.query(
                `INSERT INTO podiums (name, location_id)
                 VALUES ($1, $2)
                 RETURNING id, name, location_id AS "locationId", is_deleted AS "isDeleted"`,
                [name, locationId]
            );

            const podium = result.rows[0];

            if (!podium) throw new NotFoundError(`Backend Error Podium.create: Podium could not be created at location ID: ${locationId}`);

            return podium;
        } catch (err) {
            throw new BadRequestError(`Database error: ${err.message}`);
        }
    }

    /** GET all active podiums from database
     *
     * Returns {id, name, locationId }
     *
     * Throws error if no podiums in database
     * */
    static async getAll() {
        const query = `
        SELECT 
            id,
            name,
            location_id AS "locationId"
        FROM
            podiums
        WHERE
            is_deleted = FALSE`;

        const result = await db.query(query);

        const podiums = result.rows;
        if (!podiums.length) throw new NotFoundError(`Backend Error Podium.getAll: No podiums found in database`);

        return podiums;
    }

    /** GET  podium from database for a given id
     *
     * Returns { id, name, locationId }
     *
     * Throws error if no podium in database
     * */
    static async getById(id) {
        const query = `
        SELECT 
            id,
            name,
            location_id AS "locationId",
            is_deleted AS "isDeleted"
        FROM
            podiums p
        WHERE
            p.id = $1
        `;

        const result = await db.query(query, [id]);
        const podium = result.rows[0];
        if (!podium) throw new NotFoundError(`Backend Error Podium.getById: No podiums available with ID : ${id}`);

        return podium;
    }

    /** GET  podium from database for a given name
     *    works with partial name anywhere in the name
     * Returns { id, name, locationId }
     * Throws error if no podiums in database
     * ! This will be problematic if there are multiple podiums with the same name and most likely won't be used
     * */
    static async getByName(name) {
        const query = `
        SELECT
            id,
            name,
            location_id AS "locationId",
            is_deleted AS "isDeleted"
        FROM
            podiums p
        WHERE
            p.name ILIKE $1
        `;

        const result = await db.query(query, [`%${name}%`]);

        const podiums = result.rows;

        if (!podiums.length) throw new NotFoundError(`Backend Error Podium.getByName: No podium including name :  ${name}`);

        return podiums;
    }

    /** PATCH / Update  podium data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain all the
     * fields; this only changes provided ones.
     *
     * Data can include: { name, locationId }
     *
     * Returns { id, name, locationId }
     *
     * Throws NotFoundError if not found.
     */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, Podium.jsToSql);
        if (values.length === 0) {
            throw new BadRequestError("Backend Error Podium.update: No data provided to update");
        }

        const idVarIdx = "$" + (values.length + 1);

        const querySql = `
        UPDATE 
            podiums 
        SET ${setCols}
        WHERE id = ${idVarIdx}
        RETURNING
            id,
            name,
            location_id AS "locationId",
            is_deleted AS "isDeleted"
        `;

        const result = await db.query(querySql, [...values, id]);

        const podium = result.rows[0];

        if (!podium) throw new NotFoundError(`Backend Error Podium.update: No podium to update with ID: ${id}`);

        return podium;
    }

    /** SOFT DELETE: sets is_deleted = TRUE */
    static async remove(id) {
        const result = await db.query(`UPDATE podiums SET is_deleted = TRUE WHERE id = $1 RETURNING id`, [id]);
        const podium = result.rows[0];
        if (!podium) throw new NotFoundError(`Backend Error Podium.remove: No podium to delete with ID: ${id}`);
    }
}

module.exports = Podium;
