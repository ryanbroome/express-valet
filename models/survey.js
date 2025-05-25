"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for surveys. */

class Survey {
    /** CREATE a new survey.
     * data should be: { transactionId, q1_response, q2_response, q3_response, q4_response, q5_response, q6_response }
     * Returns { id, transactionId, q1_response, q2_response, q3_response, q4_response, q5_response, q6_response, submitted_at }
     */
    static async create({ transactionId, q1_response, q2_response, q3_response, q4_response, q5_response, q6_response }) {
        const result = await db.query(
            `INSERT INTO surveys
                (transaction_id, q1_response, q2_response, q3_response, q4_response, q5_response, q6_response)
             VALUES
                ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, transaction_id AS "transactionId", q1_response, q2_response, q3_response, q4_response, q5_response, q6_response, submitted_at`,
            [transactionId, q1_response, q2_response, q3_response, q4_response, q5_response, q6_response]
        );
        const survey = result.rows[0];

        if (!survey) throw new BadRequestError("Backend Error: Survey could not be created");

        return survey;
    }

    /** GET all surveys.
     * Returns [{...}, ...]
     * Throws NotFoundError if no surveys found.
     */
    static async getAll() {
        const result = await db.query(
            `SELECT id, transaction_id AS "transactionId", q1_response, q2_response, q3_response, q4_response, q5_response, q6_response, submitted_at AS "submittedAt"
             FROM surveys
             ORDER BY submitted_at DESC`
        );
        const surveys = result.rows;

        if (!surveys.length) throw new NotFoundError("Backend Error: No surveys found in database");

        return surveys;
    }

    /** GET survey by id.
     * Returns {...}
     * Throws NotFoundError if not found.
     */
    static async getById(id) {
        const result = await db.query(
            `SELECT id, transaction_id AS "transactionId", q1_response, q2_response, q3_response, q4_response, q5_response, q6_response, submitted_at AS "submittedAt"
             FROM surveys
             WHERE id = $1`,
            [id]
        );
        const survey = result.rows[0];

        if (!survey) throw new NotFoundError(`Backend Error: No survey found with ID: ${id}`);

        return survey;
    }

    /**
     * UPDATE survey data with `data`.
     * Data can include: { q1_response, q2_response, q3_response, q4_response, q5_response, q6_response }
     * Returns updated survey.
     * Throws NotFoundError if not found.
     */
    static async update(id, data) {
        // Map camelCase keys to snake_case columns
        const { setCols, values } = sqlForPartialUpdate(data, {
            transactionId: "transaction_id",
            q1Response: "q1_response",
            q2Response: "q2_response",
            q3Response: "q3_response",
            q4Response: "q4_response",
            q5Response: "q5_response",
            q6Response: "q6_response",
        });
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `
            UPDATE 
                surveys
            SET ${setCols}
            WHERE 
                id = ${idVarIdx}
            RETURNING 
                id, transaction_id AS "transactionId",
                q1_response AS "q1Response", 
                q2_response AS "q2Response", 
                q3_response AS "q3Response", 
                q4_response AS "q4Response", 
                q5_response AS "q5Response", 
                q6_response AS "q6Response", 
                submitted_at AS "submittedAt"
        `;
        const result = await db.query(querySql, [...values, id]);

        const survey = result.rows[0];

        if (!survey) throw new NotFoundError(`Backend Error: No survey to update with ID: ${id}`);

        return survey;
    }

    /** DELETE survey from database.
     * Throws NotFoundError if survey not found.
     */
    static async remove(id) {
        const result = await db.query(`DELETE FROM surveys WHERE id = $1 RETURNING id`, [id]);
        const deletedSurvey = result.rows[0];

        if (!deletedSurvey) throw new NotFoundError(`Backend Error: No survey to delete with ID: ${id}`);

        return { deleted: `Survey deleted with ID: ${id}` };
    }
}

module.exports = Survey;
