"AI GENERATED NEEDS REVIEW";

"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

class UserLocation {
    static async create({ userId, locationId }) {
        const duplicateCheck = await db.query(`SELECT user_id, location_id FROM user_locations WHERE user_id = $1 AND location_id = $2`, [userId, locationId]);
        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Backend Error: Duplicate user_locations relationship Location: ${locationId} already is assigned for user ID: ${userId}`);
        }
        try {
            const result = await db.query(
                `INSERT INTO user_locations (user_id, location_id)
                 VALUES ($1, $2)
                 RETURNING user_id AS "userId", location_id AS "locationId"`,
                [userId, locationId]
            );
            const newAssignment = result.rows[0];
            if (!newAssignment) throw new NotFoundError(`Backend Error UserLocation.create: Assignment could not be created for user ID: ${userId} at location ID: ${locationId}`);
            return newAssignment;
        } catch (err) {
            throw new BadRequestError(`Backend Error Database error: ${err.message}`);
        }
    }

    static async getAll() {
        const query = `
        SELECT
            user_id AS "userId",
            location_id AS "locationId"
        FROM
            user_locations`;
        const result = await db.query(query);
        const userLocation = result.rows;
        if (!userLocation.length) throw new NotFoundError(`Backend Error UserLocation.getAll: No userLocation found in database`);
        return userLocation;
    }

    static async getAllByUserId({ userId }) {
        const query = `
        SELECT
            location_id AS "locationId"
        FROM
            user_locations ul
        WHERE
            ul.user_id = $1
        `;
        const result = await db.query(query, [userId]);
        const userLocation = result.rows;
        if (!userLocation) throw new NotFoundError(`Backend Error UserLocation.getById: No userLocation found for user ID: ${userId}`);
        return userLocation;
    }

    static async remove({ userId, locationId }) {
        const result = await db.query(`DELETE FROM user_locations WHERE user_id = $1 AND location_id = $2 RETURNING user_id, location_id`, [userId, locationId]);
        const removedUserLocation = result.rows[0];
        if (!removedUserLocation) throw new NotFoundError(`Backend Error UserLocation.remove: No userLocation found for user ID: ${userId} and location ID: ${locationId}`);
        return { success: true };
    }
}

module.exports = UserLocation;
