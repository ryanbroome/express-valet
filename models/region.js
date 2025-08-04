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
            throw new BadRequestError(`Backend Error Region.create: Duplicate region: ${name}`);
        }

        try {
            const result = await db.query(
                `INSERT INTO regions (name)
                 VALUES ($1)
                 RETURNING id, name`,
                [name]
            );

            const region = result.rows[0];

            if (!region) throw new NotFoundError(`Backend Error Region.create: Region could not be created`);

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

        if (!regions.length) throw new NotFoundError(`Backend Error Region.getAll: No regions found in database`);

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

        if (!region) throw new NotFoundError(`Backend Error Region.getById: No region found with ID: ${id}`);

        return region;
    }

    /** GET regions by name.
     *
     * Returns [{ id, name }, ...]
     * Throws NotFoundError if no regions found with that name.
     */
    static async getByName(name) {
        const result = await db.query(`SELECT id, name FROM regions WHERE name ILIKE $1`, [`%${name}%`]);

        const regions = result.rows;

        if (!regions.length) throw new NotFoundError(`Backend Error Region.getByName: No regions found with name: ${name}`);

        return regions;
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

        if (!region) throw new NotFoundError(`Backend Error Region.update: No region to update with ID: ${id}`);

        return region;
    }

    /** SOFT DELETE region from database. */
    static async remove(id) {
        const result = await db.query(`UPDATE regions SET is_deleted = TRUE WHERE id = $1 RETURNING id, name, is_deleted AS "isDeleted"`, [id]);
        const region = result.rows[0];
        if (!region) throw new NotFoundError(`Backend Error Region.remove: No region to delete with ID: ${id}`);
    }
}

module.exports = Region;
