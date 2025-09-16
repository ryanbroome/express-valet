"use strict";
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

/** Related functions for data from multiple tables JOINed together. */

class Data {
    // Get today's transactions for a specific podium
    static async getTodayTransactionsByPodiumId(podiumId, userTimeZone = "UTC") {
        const query = ` 
    SELECT 
        t.id AS "id",
        t.user_id AS "userId",
        t.vehicle_id AS "vehicleId",
        t.podium_id AS "podiumId",
        t.location_id AS "locationId",
        t.status_id AS "statusId",
        t.transaction_time AS "transactionTime",
        t.updated_at AS "updatedAt"
    FROM transactions t
    WHERE t.podium_id = $1
      AND (t.transaction_time AT TIME ZONE 'UTC' AT TIME ZONE $2)::DATE = CURRENT_DATE
    ORDER BY t.transaction_time ASC
    `;
        const result = await db.query(query, [podiumId, userTimeZone]);
        return result.rows;
    }
    // Get today's transactions for a specific location
    static async getTodayTransactionsByLocationId(locationId, userTimeZone = "UTC") {
        const query = `
    SELECT 
        t.id AS "id",
        t.user_id AS "userId",
        t.vehicle_id AS "vehicleId",
        t.podium_id AS "podiumId",
        t.location_id AS "locationId",
        t.status_id AS "statusId",
        t.transaction_time AS "transactionTime",
        t.updated_at AS "updatedAt"
    FROM transactions t
    WHERE t.location_id = $1
    AND (t.transaction_time AT TIME ZONE 'UTC' AT TIME ZONE $2)::DATE = CURRENT_DATE
    ORDER BY t.transaction_time ASC`;
        const result = await db.query(query, [locationId, userTimeZone]);
        return result.rows;
    }

    //  Get transactions for multiple podiums for today
    static async getTodayTransactionsByPodiumIds(podiumIds, userTimeZone = "UTC") {
        const query = `
    SELECT 
        t.id AS "id",
        t.user_id AS "userId",
        t.vehicle_id AS "vehicleId",
        t.podium_id AS "podiumId",
        t.location_id AS "locationId",
        t.status_id AS "statusId",
        t.transaction_time AS "transactionTime",
        t.updated_at AS "updatedAt"
    FROM transactions t
    WHERE t.podium_id = ANY($1::int[])
      AND (t.transaction_time AT TIME ZONE 'UTC' AT TIME ZONE $2)::DATE = CURRENT_DATE
    ORDER BY t.transaction_time ASC`;
        const result = await db.query(query, [podiumIds, userTimeZone]);
        return result.rows;
    }
    //  Get transactions for multiple locations for today
    static async getTodayTransactionsByLocationIds(locationIds, userTimeZone = "UTC") {
        const query = `
    SELECT 
        t.id AS "id",
        t.user_id AS "userId",
        t.vehicle_id AS "vehicleId",
        t.podium_id AS "podiumId",
        t.location_id AS "locationId",
        t.status_id AS "statusId",
        t.transaction_time AS "transactionTime",
        t.updated_at AS "updatedAt"
    FROM transactions t
    WHERE t.location_id = ANY($1::int[])
      AND (t.transaction_time AT TIME ZONE 'UTC' AT TIME ZONE $2)::DATE = CURRENT_DATE
    ORDER BY t.transaction_time ASC`;
        const result = await db.query(query, [locationIds, userTimeZone]);
        return result.rows;
    }

    // Get all data from transactions, vehicles, users, locations and podiums
    static async getAllByPodiumId(podiumId) {
        const query = `
SELECT 
    -- Transactions
    t.id AS "transactionId",
    t.user_id AS "transactionUserId",
    t.vehicle_id AS "transactionVehicleId",
    t.podium_id AS "transactionPodiumId",
    t.location_id AS "transactionLocationId",
    t.status_id AS "transactionStatusId",
    t.transaction_time AS "transactionTime",
    t.updated_at AS "transactionUpdatedAt",

    -- Vehicles
    v.id AS "vehicleId",
    v.ticket_num AS "vehicleTicketNum",
    v.status_id AS "vehicleStatusId",
    v.mobile AS "vehicleMobile",
    v.color AS "vehicleColor",
    v.make AS "vehicleMake",
    v.damages AS "vehicleDamages",
    v.notes AS "vehicleNotes",

    -- Users
    u.id AS "userId",
    u.username AS "userUsername",
    u.first_name AS "userFirstName",
    u.last_name AS "userLastName",
    u.email AS "userEmail",
    u.phone AS "userPhone",
    u.total_parked AS "userTotalParked",
    u.role_id AS "userRoleId",
    u.podium_id AS "userPodiumId",

    -- Locations
    l.id AS "locationId",
    l.name AS "locationName",
    l.region_id AS "locationRegionId",
    l.address AS "locationAddress",
    l.city AS "locationCity",
    l.state AS "locationState",
    l.zip_code AS "locationZipCode",
    l.phone AS "locationPhone",

    -- Podiums
    p.id AS "podiumId",
    p.name AS "podiumName",
    p.location_id AS "podiumLocationId",

    -- Status
    s.id AS "statusId",
    s.status AS "statusDescription"

FROM 
    transactions t
    JOIN vehicles v ON t.vehicle_id = v.id
    JOIN users u ON t.user_id = u.id
    JOIN locations l ON t.location_id = l.id
    JOIN podiums p ON t.podium_id = p.id
    JOIN status s ON s.id = t.status_id
WHERE t.podium_id = $1
ORDER BY t.transaction_time ASC
`;
        const result = await db.query(query, [podiumId]);
        if (!result.rows.length) throw new NotFoundError(`Backend Data.getAllByPodiumId: No Transactions available for Podium ID: ${podiumId}`);
        return result.rows;
    }

    // GET podium names
    static async getPodiumsByLocationId(locationId) {
        const query = `
SELECT
    -- Podiums
    p.id,
    p.name,
    p.location_id
FROM 
    podiums p
WHERE p.location_id = $1
ORDER BY p.name ASC
`;
        const result = await db.query(query, [locationId]);
        if (!result.rows.length) throw new NotFoundError(`Backend Data.getPodiumsByLocationId: No Podiums found for Location ID: ${locationId}`);
        return result.rows;
    }

    static async getTransactionDetailsById(transactionId) {
        const query = `SELECT 
    -- Transactions
    t.id AS "transactionId",
    t.user_id AS "transactionUserId",
    t.vehicle_id AS "transactionVehicleId",
    t.podium_id AS "transactionPodiumId",
    t.location_id AS "transactionLocationId",
    t.status_id AS "transactionStatusId",
    t.transaction_time AS "transactionTime",
    t.updated_at AS "transactionUpdatedAt",

    -- Vehicles
    v.id AS "vehicleId",
    v.ticket_num AS "vehicleTicketNum",
    v.status_id AS "vehicleStatusId",
    v.mobile AS "vehicleMobile",
    v.color AS "vehicleColor",
    v.make AS "vehicleMake",
    v.damages AS "vehicleDamages",
    v.notes AS "vehicleNotes",

    -- Users
    u.id AS "userId",
    u.username AS "userUsername",
    u.first_name AS "userFirstName",
    u.last_name AS "userLastName",
    u.email AS "userEmail",
    u.phone AS "userPhone",
    u.total_parked AS "userTotalParked",
    u.role_id AS "userRoleId",
    u.podium_id AS "userPodiumId",

    -- Locations
    l.id AS "locationId",
    l.name AS "locationName",
    l.region_id AS "locationRegionId",
    l.address AS "locationAddress",
    l.city AS "locationCity",
    l.state AS "locationState",
    l.zip_code AS "locationZipCode",
    l.phone AS "locationPhone",

    -- Podiums
    p.id AS "podiumId",
    p.name AS "podiumName",
    p.location_id AS "podiumLocationId",

    --Status
    s.id AS "statusId",
    s.status AS "statusDescription"

FROM 
    transactions t
    JOIN vehicles v ON t.vehicle_id = v.id
    JOIN users u ON t.user_id = u.id
    JOIN locations l ON t.location_id = l.id
    JOIN podiums p ON t.podium_id = p.id
    JOIN status s ON t.status_id = s.id
WHERE t.id = $1`;
        const result = await db.query(query, [transactionId]);
        if (!result.rows.length) throw new NotFoundError("Backend Error data/ : No transaction data available");
        return result.rows;
    }
}

module.exports = Data;
