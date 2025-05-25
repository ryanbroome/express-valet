"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError, BadRequestError, UnauthorizedError } = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */
class User {
    /** authenticate user with username, password.
     *
     * Returns { username, first_name, last_name, email, phone, total_parked, role_id, podium_id }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/
    static async authenticate(username, password) {
        // try to find the user first
        const result = await db.query(
            `SELECT 
          username,
          password,
          first_name AS "firstName",
          last_name AS "lastName",
          email,
          phone, 
          total_parked AS "totalParked",
          role_id AS "roleId",
          podium_id AS "podiumId"
      FROM 
          users
      WHERE
          username = $1`,
            [username]
        );

        const user = result.rows[0];

        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Backend UnauthorizedError: Invalid username/password");
    }

    /** Register user with data.
     *
     * Returns { username, firstName, lastName, email, phone, totalParked, roleId, podiumId }
     *
     * Throws BadRequestError on duplicates.
     **/
    static async register({ username, password, firstName, lastName, email, phone, totalParked = 0, roleId, podiumId }) {
        //Example: Assume VALET_ROLE_ID is 1 (adjust as needed)

        const VALET_ROLE_ID = 1;

        //If the user is a valet, require podiumId
        if (roleId === VALET_ROLE_ID && !podiumId) {
            throw new BadRequestError("Backend BadRequestError: podiumId is required for valet users");
        }

        //For non-valet roles, set podiumid to null if not provided
        if (roleId !== VALET_ROLE_ID && !podiumId) {
            podiumId = null;
        }
        // Check if the username already exists
        const duplicateCheck = await db.query(
            `SELECT username
             FROM users
             WHERE username = $1`,
            [username]
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Backend BadRequestError: Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO 
        users
              ( username,
                password,
                first_name,
                last_name,
                email,
                phone,
                total_parked,
                role_id,
                podium_id )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email, phone, total_parked AS "totalParked", role_id AS "roleId", podium_id AS "podiumId"`,
            [username, hashedPassword, firstName, lastName, email, phone, totalParked, roleId, podiumId]
        );

        return result.rows[0];
    }

    /** Find all users.
     *
     * Returns [{ username, first_name, last_name, email, phone, totalParked, roleId, podiumId }, ...]
     **/
    static async findAll() {
        const result = await db.query(
            `SELECT
          id, 
          username,
          first_name AS "firstName",
          last_name AS "lastName",
          email,
          phone, 
          total_parked AS "totalParked",
          role_id AS "roleId",
          podium_id AS "podiumId"
      FROM 
          users
           `
        );

        return result.rows;
    }

    /** Given a username, return data about user.
     *
     * Returns { username, firstName, lastName, email, phone, totalParked, roleId, podiumId }
     *
     * Throws NotFoundError if user not found.
     **/
    static async get(username) {
        const userRes = await db.query(
            `SELECT 
          id,
          username,
          first_name AS "firstName",
          last_name AS "lastName",
          email,
          phone, 
          total_parked AS "totalParked",
          role_id AS "roleId",
          podium_id AS "podiumId"
      FROM 
          users
      WHERE 
          username = $1`,
            [username]
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`Backend NotFoundError: No user with username: ${username}`);

        return user;
    }

    /** Given a podiumId, return data about users */
    static async getByPodiumId(podiumId) {
        const userRes = await db.query(
            `SELECT
            id,
            username,
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            phone,
            total_parked AS "totalParked",
            role_id AS "roleId",
            podium_id AS "podiumId"
        FROM
            users
        WHERE
            podium_id = $1`,
            [podiumId]
        );
        if (userRes.rows.length === 0) throw new NotFoundError(`Backend NotFoundError: No user(s) with podiumId: ${podiumId}`);

        return userRes.rows;
    }

    /** Given a roleId. return all users data with that roleId */
    static async getByRoleId(roleId) {
        const userRes = await db.query(
            `SELECT
            id,
            username,
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            phone,
            total_parked AS "totalParked",
            role_id AS "roleId",
            podium_id AS "podiumId"
        FROM
            users
        WHERE
            role_id = $1`,
            [roleId]
        );
        if (userRes.rows.length === 0) throw new NotFoundError(`Backend NotFoundError: No user(s) with roleId: ${roleId}`);
        return userRes.rows;
    }

    /** Given a username, return data about user.
     *
     * Returns { username, firstName, lastName, email, phone, totalParked, roleId, podiumId }
     *
     * Throws NotFoundError if user not found.
     **/
    static async getById(id) {
        const userRes = await db.query(
            `SELECT 
          id,
          username,
          first_name AS "firstName",
          last_name AS "lastName",
          email,
          phone, 
          total_parked AS "totalParked",
          role_id AS "roleId",
          podium_id AS "podiumId"
      FROM 
          users
      WHERE 
          id = $1`,
            [id]
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`Backend NotFoundError: No user with ID: ${id}`);

        return user;
    }

    /** Update user data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { firstName, lastName, password, email, phone, totalParked, roleId, podiumId }
     *
     * Returns { username, firstName, lastName, email, phone, totalParked, roleId, podiumId }
     *
     * Throws NotFoundError if not found.
     *
     * WARNING: this function can set a new password or change the user's role_id.
     * Callers of this function must be certain they have validated inputs to this
     * or a serious security risks are opened.
     */
    static async update(username, data) {
        // check to make sure data was provided to the update function
        // if not, throw a BadRequestError
        if (Object.keys(data).length === 0) {
            throw new BadRequestError("Backend BadRequestError: No Data provided for update");
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const { setCols, values } = sqlForPartialUpdate(data, {
            firstName: "first_name",
            lastName: "last_name",
            totalParked: "total_parked",
            roleId: "role_id",
            podiumId: "podium_id",
        });

        const usernameVarIdx = "$" + (values.length + 1);
        const querySql = `
        UPDATE 
            users 
        SET ${setCols} 
        WHERE 
            username = ${usernameVarIdx} 
        RETURNING
            id, 
            username,
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            phone, 
            total_parked AS "totalParked",
            role_id AS "roleId",
            podium_id AS "podiumId"`;

        const result = await db.query(querySql, [...values, username]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`Backend NotFoundError: No user with username: ${username}`);

        delete user.password;
        return user;
    }

    /** Increment the total_parked count for a user by 1. */
    static async incrementParked(username) {
        try {
            const query = `
      UPDATE 
        users
      SET 
        total_parked = total_parked + 1
      WHERE 
        username = $1
      RETURNING
        username,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        phone, 
        total_parked AS "totalParked",
        role_id AS "roleId",
        podium_id AS "podiumId"
        `;

            const result = await db.query(query, [username]);

            const user = result.rows[0];

            if (!user) throw new NotFoundError(`Backend NotFoundError: No user: ${username}`);

            return user;
        } catch (err) {
            console.error(err);
        }
    }

    /** Delete given user from database; returns undefined. */
    static async remove(username) {
        let result = await db.query(
            `DELETE
        FROM 
            users
        WHERE 
            username = $1
        RETURNING 
            username`,
            [username]
        );
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`Backend NotFoundError: No user: ${username}`);
    }

    /** Delete given user from database; returns undefined. */
    static async removeById(id) {
        let result = await db.query(
            `DELETE
        FROM 
            users
        WHERE 
            id = $1
        RETURNING 
            id`,
            [id]
        );
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`Backend NotFoundError: No user with ID: ${id}`);
    }
}

module.exports = User;
