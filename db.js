"use strict";
/** Database setup for valet. */
const { Pool } = require("pg");
const { getDatabaseUri } = require("./config");

const db = new Pool({
    connectionString: getDatabaseUri(),
    ssl:
        process.env.NODE_ENV === "production"
            ? {
                  rejectUnauthorized: false,
              }
            : false,
    connectionTimeoutMillis: 5000,
    max: 20,
});

// Add connection monitoring
db.on("connect", () => {
    console.log("Database connected");
});

db.on("error", (err) => {
    console.error("Unexpected database error:", err);
});

module.exports = db;
