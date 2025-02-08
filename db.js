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

db.on("connect", () => {
    console.log("Database connected");
    // Log database name without credentials
    const dbName = getDatabaseUri().split("/").pop();
    console.log(`Connected to database: ${dbName}`);
});

db.on("error", (err) => {
    console.error("Database error:", {
        code: err.code,
        message: err.message,
        detail: err.detail,
    });
});
