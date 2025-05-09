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
     * Returns { username, first_name, last_name, email, phone, total_parked, is_admin}
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
          is_admin AS "isAdmin",
          location_id AS "locationId"
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
                console.log("BCRYPT PASWORD =>", password);
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }

    /** Register user with data.
     *
     * Returns { username, firstName, lastName, email, phone, totalParked, isAdmin }
     *
     * Throws BadRequestError on duplicates.
     **/
    static async register({ username, password, firstName, lastName, email, phone, locationId, totalParked = 0, isAdmin = false }) {
        const duplicateCheck = await db.query(
            `SELECT username
           FROM users
           WHERE username = $1`,
            [username]
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        console.log("HASHEDPW", "$=>>  ", hashedPassword, "  <<=$");

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
                is_admin,
                location_id )
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email, phone, total_parked AS "totalParked", is_admin AS "isAdmin", location_id AS "locationId"`,
            [username, hashedPassword, firstName, lastName, email, phone, totalParked, isAdmin, locationId]
        );

        const user = result.rows[0];

        return user;
    }

    /** Find all users.
     *
     * Returns [{ username, first_name, last_name, email, phone, totalParked, isAdmin, locationId }, ...]
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
          is_admin AS "isAdmin",
          location_id AS "locationId"
      FROM 
          users
           `
        );

        return result.rows;
    }

    /** Given a username, return data about user.
     *
     * Returns { username, firstName, lastName, email, phone, totalParked, isAdmin, locationId }
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
          is_admin AS "isAdmin",
          location_id AS "locationId"
      FROM 
          users
      WHERE 
          username = $1`,
            [username]
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`No user with username: ${username}`);

        return user;
    }

    /** Given a username, return data about user.
     *
     * Returns { username, firstName, lastName, email, phone, totalParked, isAdmin, locationId }
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
          is_admin AS "isAdmin",
          location_id AS "locationId"
      FROM 
          users
      WHERE 
          id = $1`,
            [id]
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`No user with ID: ${id}`);

        return user;
    }

    /** Update user data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { firstName, lastName, password, email, phone, totalParked, isAdmin, password }
     *
     * Returns { username, firstName, lastName, email, phone, totalParked, isAdmin }
     *
     * Throws NotFoundError if not found.
     *
     * WARNING: this function can set a new password or make a user an admin.
     * Callers of this function must be certain they have validated inputs to this
     * or a serious security risks are opened.
     */
    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const { setCols, values } = sqlForPartialUpdate(data, {
            firstName: "first_name",
            lastName: "last_name",
            isAdmin: "is_admin",
            totalParked: "total_parked",
            locationId: "location_id",
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
            is_admin AS "isAdmin",
            location_id AS "locationId"`;

        const result = await db.query(querySql, [...values, username]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user with username: ${username}`);

        delete user.password;
        return user;
    }

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
        is_admin AS "isAdmin",
        location_id AS "locationId"
        `;

            const result = await db.query(query, [username]);

            const user = result.rows[0];

            if (!user) throw new NotFoundError(`No user: ${username}`);

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

        if (!user) throw new NotFoundError(`No user: ${username}`);
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

        if (!user) throw new NotFoundError(`No user with ID: ${id}`);
    }
}

module.exports = User;
