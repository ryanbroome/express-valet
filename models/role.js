"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for roles. */

class Role {
    /** CREATE a new role.
     * ? If not working try removing the object from argument . example Role.create(role) vs Role.create({ role })
     * data should be { role }
     * Returns  newRole: { id, role }
     * Throws BadRequestError if role already exists.
     */
    static async create({ role }) {
        // Check for duplicate role
        const duplicateCheck = await db.query(`SELECT id FROM roles WHERE role = $1 AND is_deleted = FALSE`, [role]);

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Backend Error: Duplicate role: ${role}`);
        }

        try {
            const result = await db.query(`INSERT INTO roles (role) VALUES ($1) RETURNING id, role`, [role]);

            const newRole = result.rows[0];

            if (!newRole) throw new NotFoundError(`Backend Error: Role could not be created`);

            return newRole;
        } catch (err) {
            throw new BadRequestError(`Database error: ${err.message}`);
        }
    }

    /** GET all roles.
     *
     * Returns [{ id, role }, ...]
     * Throws NotFoundError if no roles found.
     */
    static async getAll() {
        const result = await db.query(`SELECT id, role FROM roles WHERE is_deleted = FALSE ORDER BY id`);
        const roles = result.rows;
        if (!roles.length) throw new NotFoundError(`Backend Error: No roles found in database`);
        return roles;
    }

    /** GET role by id.
     *
     * Returns { id, role }
     * Throws NotFoundError if not found.
     */
    static async getById(id) {
        const result = await db.query(`SELECT id, role FROM roles WHERE id = $1 AND is_deleted = FALSE`, [id]);
        const role = result.rows[0];
        if (!role) throw new NotFoundError(`Backend Error: No role found with ID: ${id}`);
        return role;
    }

    /** UPDATE role data with `data`.
     *
     * Data can include: { role }
     * Returns { id, role }
     * Throws NotFoundError if not found.
     */
    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(data, {});
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `
            UPDATE roles
            SET ${setCols}
            WHERE id = ${idVarIdx} 
            AND is_deleted = FALSE
            RETURNING id, role
        `;
        const result = await db.query(querySql, [...values, id]);
        const updatedRole = result.rows[0];

        if (!updatedRole) throw new NotFoundError(`Backend Error: No role to update with ID: ${id}`);
        return updatedRole;
    }

    /** SOFT DELETE: sets is_deleted = TRUE */
    static async remove(id) {
        const result = await db.query(`UPDATE roles SET is_deleted = TRUE WHERE id = $1 RETURNING id`, [id]);

        const deletedRole = result.rows[0];

        if (!deletedRole) throw new NotFoundError(`Backend Error: No role to delete with ID: ${id}`);

        return { deleted: `Role deleted with ID: ${id}` };
    }
}

module.exports = Role;
