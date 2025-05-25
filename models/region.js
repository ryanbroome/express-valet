"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for regions. */

class Region {
    /** CREATE a new region.
     *
     * data should be { name }
     * Returns { id, name }
     * Throws BadRequestError if region name already exists.
     */
    static async create({ name }) {
        // Check for duplicate region name
        const duplicateCheck = await db.query(`SELECT id FROM regions WHERE name = $1`, [name]);

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Backend Error: Duplicate region: ${name}`);
        }

        try {
            const result = await db.query(
                `INSERT INTO regions (name)
                 VALUES ($1)
                 RETURNING id, name`,
                [name]
            );

            const region = result.rows[0];

            if (!region) throw new NotFoundError(`Backend Error: Region could not be created`);

            return region;
        } catch (err) {
            throw new BadRequestError(`Database error: ${err.message}`);
        }
    }

    /** GET all regions.
     *
     * Returns [{ id, name }, ...]
     * Throws NotFoundError if no regions found.
     */
    static async getAll() {
        const result = await db.query(`SELECT id, name FROM regions ORDER BY id`);

        const regions = result.rows;

        if (!regions.length) throw new NotFoundError(`Backend Error: No regions found in database`);

        return regions;
    }

    /** GET region by id.
     *
     * Returns { id, name }
     * Throws NotFoundError if not found.
     */
    static async getById(id) {
        const result = await db.query(`SELECT id, name FROM regions WHERE id = $1`, [id]);

        const region = result.rows[0];

        if (!region) throw new NotFoundError(`Backend Error: No region found with ID: ${id}`);

        return region;
    }

    /** UPDATE region data with `data`.
     *
     * Data can include: { name }
     * Returns { id, name }
     * Throws NotFoundError if not found.
     */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {});
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `
            UPDATE regions
            SET ${setCols}
            WHERE id = ${idVarIdx}
            RETURNING id, name
        `;
        const result = await db.query(querySql, [...values, id]);

        const region = result.rows[0];

        if (!region) throw new NotFoundError(`Backend Error: No region to update with ID: ${id}`);

        return region;
    }

    /** DELETE region from database.
     *
     * Throws NotFoundError if region not found.
     */
    static async remove(id) {
        const result = await db.query(`DELETE FROM regions WHERE id = $1 RETURNING id`, [id]);
        const region = result.rows[0];
        if (!region) throw new NotFoundError(`Backend Error: No region to delete with ID: ${id}`);
    }
}

module.exports = Region;
