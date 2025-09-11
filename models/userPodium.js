"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for podiums. */

class UserPodium {
    /** POST / Create a UserPodium relationship update db, return new UserPodium data.
     *
     * data should be {  userId, podiumId }
     *
     * Returns { success : id }
     *
     * Throws error if user podium relationship already exists in database.
     * */
    static async create({ userId, podiumId }) {
        // Check for duplicate podium at the same location
        const duplicateCheck = await db.query(`SELECT user_id, podium_id FROM user_podiums WHERE user_id = $1 AND podium_id = $2`, [userId, podiumId]);

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Backend Error: Duplicate user_podiums relationship Podium: ${podiumId} already is assigned for user ID: ${userId}`);
        }

        try {
            const result = await db.query(
                `INSERT INTO user_podiums (user_id, podium_id)
                 VALUES ($1, $2)
                 RETURNING user_id AS "userId", podium_id AS "podiumId"`,
                [userId, podiumId]
            );

            const newAssignment = result.rows[0];

            if (!newAssignment) throw new NotFoundError(`Backend Error UserPodium.create: Assignment could not be created for user ID: ${userId} at podium ID: ${podiumId}`);

            return newAssignment;
        } catch (err) {
            throw new BadRequestError(`Backend Error Database error: ${err.message}`);
        }
    }

    /** GET all active userPodium from database
     *
     * Returns { userId, podiumId }
     *
     * Throws error if no userPodium in database
     * */
    static async getAll() {
        const query = `
        SELECT
            user_id AS "userId",
            podium_id AS "podiumId"
        FROM
            user_podiums`;

        const result = await db.query(query);

        const userPodium = result.rows;
        if (!userPodium.length) throw new NotFoundError(`Backend Error UserPodium.getAll: No userPodium found in database`);

        return userPodium;
    }

    /** GET  userPodium from database for a given userId & podiumId
     *
     * Returns [{ podiumId }, ... ]
     *
     * Throws error if no userPodium in database
     * */
    static async getAllByUserId({ userId }) {
        const query = `
SELECT
    p.id AS "podiumId",
    p.name AS "podiumName",
    p.location_id AS "locationId"
FROM user_podiums up
JOIN podiums p ON up.podium_id = p.id
WHERE up.user_id = $1
        `;

        const result = await db.query(query, [userId]);
        const userPodium = result.rows;
        if (!userPodium) throw new NotFoundError(`Backend Error UserPodium.getById: No userPodium found for user ID: ${userId}`);

        return userPodium;
    }

    /** DELETE: removes a userPodium and deletes userPodium from user_podiums database table  */
    static async remove({ userId, podiumId }) {
        const result = await db.query(`DELETE FROM user_podiums WHERE user_id = $1 AND podium_id = $2`, [userId, podiumId]);
        const removedUserPodium = result.rows[0];
        if (!removedUserPodium) throw new NotFoundError(`Backend Error UserPodium.remove: No userPodium found for user ID: ${userId} and podium ID: ${podiumId}`);

        return { success: true };
    }
}

module.exports = UserPodium;
