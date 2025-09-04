"AI GENERATED NEEDS REVIEW";

"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class UserRegion {
    static async create({ userId, regionId }) {
        const duplicateCheck = await db.query(`SELECT user_id, region_id FROM user_regions WHERE user_id = $1 AND region_id = $2`, [userId, regionId]);
        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Backend Error: Duplicate user_regions relationship Region: ${regionId} already is assigned for user ID: ${userId}`);
        }
        try {
            const result = await db.query(
                `INSERT INTO user_regions (user_id, region_id)
                 VALUES ($1, $2)
                 RETURNING user_id AS "userId", region_id AS "regionId"`,
                [userId, regionId]
            );
            const newAssignment = result.rows[0];
            if (!newAssignment) throw new NotFoundError(`Backend Error UserRegion.create: Assignment could not be created for user ID: ${userId} at region ID: ${regionId}`);
            return newAssignment;
        } catch (err) {
            throw new BadRequestError(`Backend Error Database error: ${err.message}`);
        }
    }

    static async getAll() {
        const query = `
        SELECT
            user_id AS "userId",
            region_id AS "regionId"
        FROM
            user_regions`;
        const result = await db.query(query);
        const userRegion = result.rows;
        if (!userRegion.length) throw new NotFoundError(`Backend Error UserRegion.getAll: No userRegion found in database`);
        return userRegion;
    }

    static async getAllByUserId({ userId }) {
        const query = `
        SELECT
            region_id AS "regionId"
        FROM
            user_regions ur
        WHERE
            ur.user_id = $1
        `;
        const result = await db.query(query, [userId]);
        const userRegion = result.rows;
        if (!userRegion) throw new NotFoundError(`Backend Error UserRegion.getById: No userRegion found for user ID: ${userId}`);
        return userRegion;
    }

    static async remove({ userId, regionId }) {
        const result = await db.query(`DELETE FROM user_regions WHERE user_id = $1 AND region_id = $2 RETURNING user_id, region_id`, [userId, regionId]);
        const removedUserRegion = result.rows[0];
        if (!removedUserRegion) throw new NotFoundError(`Backend Error UserRegion.remove: No userRegion found for user ID: ${userId} and region ID: ${regionId}`);
        return { success: true };
    }
}

module.exports = UserRegion;
