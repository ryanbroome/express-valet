"use strict";
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

/** Related functions for data from multiple tables JOINed together. */

class Data {
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
    p.location_id AS "podiumLocationId"

FROM 
    transactions t
    JOIN vehicles v ON t.vehicle_id = v.id
    JOIN users u ON t.user_id = u.id
    JOIN locations l ON t.location_id = l.id
    JOIN podiums p ON t.podium_id = p.id
WHERE t.podium_id = $1
ORDER BY t.transaction_time ASC
`;
        const result = await db.query(query, [podiumId]);
        if (!result.rows.length) throw new NotFoundError("Backend Error: No data available");
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

    // /** GET transactions in a date range */

    // static async range({ startYear, startMonth, startDay, endYear, endMonth, endDay }) {
    //     const startDate = `${startYear}-${startMonth}-${startDay}`;
    //     const endDate = `${endYear}-${endMonth}-${endDay}`;
    //     const query = `
    //         SELECT
    //             t.id AS "transactionId",
    //             t.user_id AS "userId",
    //             t.vehicle_id AS "vehicleId",
    //             t.podium_id AS "podiumId",
    //             t.location_id AS "locationId",
    //             t.status_id AS "transactionStatusId",
    //             t.transaction_time AS "transactionTime",
    //             t.updated_at AS "updatedAt",

    //             v.id AS "vehicleId",
    //             v.ticket_num AS "ticketNum",
    //             v.status_id AS "vehicleStatusId",
    //             v.mobile AS "mobile",
    //             v.color AS "color",
    //             v.make AS "make",
    //             v.damages AS "damages",
    //             v.notes AS "notes",

    //             p.id AS "podiumId",
    //             p.name AS "podiumName",
    //             p.location_id AS "podiumLocationId",

    //             l.id AS "locationId",
    //             l.name AS "locationName",
    //             l.region_id AS "regionId",
    //             l.address AS "locationAddress",
    //             l.city AS "locationCity",
    //             l.state AS "locationState",
    //             l.zip_code AS "locationZipCode",
    //             l.phone AS "locationPhone",

    //             u.id AS "userId",
    //             u.username AS "username",
    //             u.first_name AS "firstName",
    //             u.last_name AS "lastName",
    //             u.email AS "email",
    //             u.phone AS "phone",
    //             u.total_parked AS "totalParked",
    //             u.role_id AS "roleId",
    //             u.podium_id AS "userPodiumId"
    //         FROM
    //             transactions t
    //         JOIN vehicles v ON t.vehicle_id = v.id
    //         JOIN users u ON t.user_id = u.id
    //         JOIN locations l ON t.location_id = l.id
    //         JOIN podiums p ON t.podium_id = p.id
    //         WHERE t.transaction_time >= $1 AND t.transaction_time <= $2
    //         ORDER BY t.transaction_time ASC
    //     `;
    //     const result = await db.query(query, [startDate, endDate]);
    //     if (!result.rows.length) throw new NotFoundError(`Backend Error: No transactions available between ${startDate} and ${endDate}`);
    //     return result.rows;
    // }

    // /** GET today's transactions by location */
    // static async getTodayByLocation({ locationId }) {
    //     const query = `
    //         SELECT
    //             t.id AS "transactionId",
    //             t.user_id AS "userId",
    //             t.vehicle_id AS "vehicleId",
    //             t.location_id AS "locationId",
    //             t.transaction_time AS "transactionTime",

    //             v.ticket_num AS "ticketNum",
    //             v.status_id AS "vehicleStatusId",
    //             v.check_in AS "checkIn",
    //             v.mobile AS "mobile",
    //             v.color AS "color",
    //             v.make AS "make",
    //             v.damages AS "damages",
    //             v.check_out AS "checkOut",
    //             v.notes AS "notes",

    //             l.name AS "locationName",

    //             u.first_name AS "firstName",
    //             u.last_name AS "lastName",
    //             u.phone AS "phone",
    //             u.email AS "email",
    //             u.total_parked AS "totalParked",
    //             u.role_id AS "roleId"
    //         FROM
    //             transactions t
    //         JOIN vehicles v ON t.vehicle_id = v.id
    //         JOIN users u ON t.user_id = u.id
    //         JOIN locations l ON t.location_id = l.id
    //         WHERE t.location_id = $1
    //           AND t.transaction_time::DATE = CURRENT_DATE
    //         ORDER BY t.transaction_time ASC
    //     `;
    //     const result = await db.query(query, [locationId]);
    //     if (!result.rows.length) throw new NotFoundError(`Backend Error: No transactions available at locationId ${locationId} for today`);
    //     return result.rows;
    // }

    // /** GET transactions by location and status */
    // static async allByLocationStatus(locationId, statusId) {
    //     const query = `
    //         SELECT
    //             t.id AS "transactionId",
    //             t.user_id AS "userId",
    //             t.vehicle_id AS "vehicleId",
    //             t.location_id AS "locationId",
    //             t.transaction_time AS "transactionTime",
    //             v.ticket_num AS "ticketNum",
    //             v.status_id AS "vehicleStatusId",
    //             v.check_in AS "checkIn",
    //             v.mobile AS "mobile",
    //             v.color AS "color",
    //             v.make AS "make",
    //             v.damages AS "damages",
    //             v.check_out AS "checkOut",
    //             v.notes AS "notes",
    //             l.name AS "locationName",
    //             u.first_name AS "firstName",
    //             u.last_name AS "lastName",
    //             u.phone AS "phone",
    //             u.email AS "email",
    //             u.total_parked AS "totalParked",
    //             u.role_id AS "roleId"
    //         FROM
    //             transactions t
    //         JOIN vehicles v ON t.vehicle_id = v.id
    //         JOIN users u ON t.user_id = u.id
    //         JOIN locations l ON t.location_id = l.id
    //         WHERE t.location_id = $1
    //           AND v.status_id = $2
    //         ORDER BY v.mobile ASC
    //     `;
    //     const result = await db.query(query, [locationId, statusId]);
    //     if (!result.rows.length) throw new NotFoundError(`Backend Error: No transactions available at location ${locationId} for status ${statusId}`);
    //     return result.rows;
    // }

    // /** GET transactions by location and user */
    // static async allByLocationUserId(locationId, userId) {
    //     const query = `
    //         SELECT
    //             t.id AS "transactionId",
    //             t.user_id AS "userId",
    //             t.vehicle_id AS "vehicleId",
    //             t.location_id AS "locationId",
    //             t.transaction_time AS "transactionTime",
    //             v.ticket_num AS "ticketNum",
    //             v.status_id AS "vehicleStatusId",
    //             v.check_in AS "checkIn",
    //             v.mobile AS "mobile",
    //             v.color AS "color",
    //             v.make AS "make",
    //             v.damages AS "damages",
    //             v.check_out AS "checkOut",
    //             v.notes AS "notes",
    //             l.name AS "locationName",
    //             u.first_name AS "firstName",
    //             u.last_name AS "lastName",
    //             u.phone AS "phone",
    //             u.email AS "email",
    //             u.total_parked AS "totalParked",
    //             u.role_id AS "roleId"
    //         FROM
    //             transactions t
    //         JOIN vehicles v ON t.vehicle_id = v.id
    //         JOIN users u ON t.user_id = u.id
    //         JOIN locations l ON t.location_id = l.id
    //         WHERE l.id = $1
    //           AND u.id = $2
    //           AND v.status_id = (SELECT id FROM status WHERE status = 'parked')
    //     `;
    //     const result = await db.query(query, [locationId, userId]);
    //     if (!result.rows.length) throw new NotFoundError(`Backend Error: No transactions available at location ${locationId} for user ${userId}`);
    //     return result.rows;
    // }

    // /** GET last 10  transactions by location and user (lost keys) */
    // static async lostKeys(locationId, userId) {
    //     const query = `
    //         SELECT
    //             t.id AS "transactionId",
    //             t.user_id AS "userId",
    //             t.vehicle_id AS "vehicleId",
    //             t.location_id AS "locationId",
    //             t.transaction_time AS "transactionTime",

    //             v.ticket_num AS "ticketNum",
    //             v.status_id AS "vehicleStatusId",
    //             v.check_in AS "checkIn",
    //             v.mobile AS "mobile",
    //             v.color AS "color",
    //             v.make AS "make",
    //             v.damages AS "damages",
    //             v.check_out AS "checkOut",
    //             v.notes AS "notes",

    //             l.name AS "locationName",

    //             u.first_name AS "firstName",
    //             u.last_name AS "lastName",
    //             u.phone AS "phone",
    //             u.email AS "email",
    //             u.total_parked AS "totalParked",
    //             u.role_id AS "roleId"

    //         FROM
    //             transactions t
    //         JOIN vehicles v ON t.vehicle_id = v.id
    //         JOIN users u ON t.user_id = u.id
    //         JOIN locations l ON t.location_id = l.id
    //         WHERE l.id = $1
    //         AND u.id = $2
    //         ORDER BY
    //             t.id
    //         DESC
    //         LIMIT 10
    //     `;
    //     const result = await db.query(query, [locationId, userId]);
    //     if (!result.rows.length) throw new NotFoundError(`Backend Error: No transactions available at location ${locationId} for user ${userId}`);
    //     return result.rows;
    // }

    // /** GET transactions by location and partial mobile */
    // static async byLocationMobile(locationId, mobile) {
    //     const query = `
    //         SELECT
    //             t.id AS "transactionId",
    //             t.user_id AS "userId",
    //             t.vehicle_id AS "vehicleId",
    //             t.location_id AS "locationId",
    //             t.transaction_time AS "transactionTime",
    //             v.ticket_num AS "ticketNum",
    //             v.status_id AS "vehicleStatusId",
    //             v.check_in AS "checkIn",
    //             v.mobile AS "mobile",
    //             v.color AS "color",
    //             v.make AS "make",
    //             v.damages AS "damages",
    //             v.check_out AS "checkOut",
    //             v.notes AS "notes",
    //             l.name AS "locationName",
    //             u.first_name AS "firstName",
    //             u.last_name AS "lastName",
    //             u.phone AS "phone",
    //             u.email AS "email",
    //             u.total_parked AS "totalParked",
    //             u.role_id AS "roleId"
    //         FROM
    //             transactions t
    //         JOIN vehicles v ON t.vehicle_id = v.id
    //         JOIN users u ON t.user_id = u.id
    //         JOIN locations l ON t.location_id = l.id
    //         WHERE v.mobile ILIKE $1
    //           AND v.status_id = (SELECT id FROM status WHERE status = 'parked')
    //           AND t.location_id = $2
    //         ORDER BY v.mobile ASC
    //     `;
    //     const result = await db.query(query, [`%${mobile}%`, locationId]);
    //     if (!result.rows.length) throw new NotFoundError(`Backend Error: No transactions available with mobile : ${mobile}`);
    //     return result.rows;
    // }

    // /** GET today's transactions with optional filters */
    // static async getTodayData({ statusId = null, podiumId = null, locationId = null } = {}) {
    //     let whereClauses = [`t.transaction_time::DATE = CURRENT_DATE`];
    //     let values = [];
    //     let idx = 1;

    //     if (statusId !== null) {
    //         whereClauses.push(`v.status_id = $${idx++}`);
    //         values.push(statusId);
    //     }
    //     if (podiumId !== null) {
    //         whereClauses.push(`t.podium_id = $${idx++}`);
    //         values.push(podiumId);
    //     }
    //     if (locationId !== null) {
    //         whereClauses.push(`t.location_id = $${idx++}`);
    //         values.push(locationId);
    //     }

    //     const whereSql = whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : "";

    //     const query = `
    //         SELECT
    //             t.id AS "transactionId",
    //             t.user_id AS "userId",
    //             t.vehicle_id AS "vehicleId",
    //             t.podium_id AS "podiumId",
    //             t.location_id AS "locationId",
    //             t.status_id AS "transactionStatusId",
    //             t.transaction_time AS "transactionTime",
    //             t.updated_at AS "updatedAt",

    //             v.id AS "vehicleId",
    //             v.ticket_num AS "ticketNum",
    //             v.status_id AS "vehicleStatusId",
    //             v.mobile AS "mobile",
    //             v.color AS "color",
    //             v.make AS "make",
    //             v.damages AS "damages",
    //             v.notes AS "notes",

    //             p.id AS "podiumId",
    //             p.name AS "podiumName",
    //             p.location_id AS "podiumLocationId",

    //             l.id AS "locationId",
    //             l.name AS "locationName",
    //             l.region_id AS "regionId",
    //             l.address AS "locationAddress",
    //             l.city AS "locationCity",
    //             l.state AS "locationState",
    //             l.zip_code AS "locationZipCode",
    //             l.phone AS "locationPhone",

    //             u.id AS "userId",
    //             u.username AS "username",
    //             u.first_name AS "firstName",
    //             u.last_name AS "lastName",
    //             u.email AS "email",
    //             u.phone AS "phone",
    //             u.total_parked AS "totalParked",
    //             u.role_id AS "roleId",
    //             u.podium_id AS "userPodiumId"
    //         FROM
    //             transactions t
    //         JOIN vehicles v ON t.vehicle_id = v.id
    //         JOIN users u ON t.user_id = u.id
    //         JOIN locations l ON t.location_id = l.id
    //         JOIN podiums p ON t.podium_id = p.id
    //         ${whereSql}
    //         ORDER BY t.transaction_time ASC
    //     `;
    //     const result = await db.query(query, values);
    //     if (!result.rows.length) throw new NotFoundError(`Backend Error: No transactions available for today with statusId: ${statusId}, podiumId: ${podiumId}, locationId: ${locationId}`);
    //     return result.rows;
    // }
}

module.exports = Data;
