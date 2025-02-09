"use strict";
const { Pool } = require("pg");
const { getDatabaseUri } = require("./config");

const poolConfig = {
    connectionString: getDatabaseUri(),
    ssl:
        process.env.NODE_ENV === "production"
            ? {
                  rejectUnauthorized: false,
              }
            : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
};

const db = new Pool(poolConfig);

// Verify connection on startup
const verifyConnection = async () => {
    try {
        const client = await db.connect();
        const result = await client.query("SELECT version()");
        console.log("PostgreSQL version:", result.rows[0].version);
        client.release();
        return true;
    } catch (err) {
        console.error("Database connection failed:", {
            error: err.message,
            host: new URL(getDatabaseUri()).host,
        });
        return false;
    }
};

verifyConnection();

module.exports = db;
