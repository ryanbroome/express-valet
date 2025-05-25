"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for status. */

class Status {
    /** CREATE a new status.
     * data should be { status }
     * Returns { id, status }
     * Throws BadRequestError if status already exists.
     */
    static async create({ status }) {
        const duplicateCheck = await db.query(`SELECT id FROM status WHERE status = $1`, [status]);

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Backend Error: Duplicate status: ${status}`);
        }

        try {
            const result = await db.query(
                `INSERT INTO 
                        status (status)
                 VALUES ($1)
                 RETURNING 
                        id, status`,
                [status]
            );
            const newStatus = result.rows[0];

            if (!newStatus) throw new NotFoundError(`Backend Error: Status could not be created`);

            return newStatus;
        } catch (err) {
            throw new BadRequestError(`Database error: ${err.message}`);
        }
    }

    /** GET all statuses.
     * Returns [{ id, status }, ...]
     * Throws NotFoundError if no statuses found.
     */
    static async getAll() {
        const result = await db.query(`SELECT id, status FROM status ORDER BY id`);

        const statuses = result.rows;

        if (!statuses.length) throw new NotFoundError(`Backend Error: No statuses found in database`);

        return statuses;
    }

    /** GET status by id.
     * Returns { id, status }
     * Throws NotFoundError if not found.
     */
    static async getById(id) {
        const result = await db.query(`SELECT id, status FROM status WHERE id = $1`, [id]);

        const status = result.rows[0];

        if (!status) throw new NotFoundError(`Backend Error: No status found with ID: ${id}`);

        return status;
    }

    /** UPDATE status data with `data`.
     * Data can include: { status }
     * Returns { id, status }
     * Throws NotFoundError if not found.
     */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {});
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `
            UPDATE status
            SET ${setCols}
            WHERE id = ${idVarIdx}
            RETURNING id, status
        `;
        const result = await db.query(querySql, [...values, id]);

        const updatedStatus = result.rows[0];

        if (!updatedStatus) throw new NotFoundError(`Backend Error: No status to update with ID: ${id}`);

        return updatedStatus;
    }

    /** DELETE status from database.
     * Throws NotFoundError if status not found.
     */
    static async remove(id) {
        const result = await db.query(`DELETE FROM status WHERE id = $1 RETURNING id`, [id]);

        const deletedStatus = result.rows[0];

        if (!deletedStatus) throw new NotFoundError(`Backend Error: No status to delete with ID: ${id}`);

        return { deleted: `Status deleted with ID: ${id}` };
    }
}

module.exports = Status;
