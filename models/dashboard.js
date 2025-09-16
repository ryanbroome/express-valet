"use strict";
const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

// Dashboard-related functions

class Dashboard {
    static async getTodayTransactionStatsByPodiumIds(podiumIds, userTimeZone = "UTC") {
        const query = `
        SELECT
            COUNT(*) AS "totalCount",
            COUNT(*) FILTER (WHERE t.status_id = 1) AS "checkedInCount",
            COUNT(*) FILTER (WHERE t.status_id = 2) AS "stagedCount",
            COUNT(*) FILTER (WHERE t.status_id = 3) AS "parkedCount",
            COUNT(*) FILTER (WHERE t.status_id = 4) AS "requestedCount",
            COUNT(*) FILTER (WHERE t.status_id = 5) AS "retrievedCount",
            COUNT(*) FILTER (WHERE t.status_id = 6) AS "checkedOutCount"
        FROM transactions t
        WHERE t.podium_id = ANY($1::int[])
          AND (t.transaction_time AT TIME ZONE 'UTC' AT TIME ZONE $2)::DATE = CURRENT_DATE
    `;
        const result = await db.query(query, [podiumIds, userTimeZone]);
        return result.rows[0];
    }
}
