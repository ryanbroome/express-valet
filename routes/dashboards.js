"use strict";

// Routes for dashboard / reporting
const jsonschema = require("jsonschema");
const express = require("express");
const Dashboard = require("../models/dashboard");
const router = new express.Router();

router.get("/dashboard/transactionStats/today", async function (req, res, next) {
    try {
        const podiumIds = req.query.podiumIds.split(",").map(Number); // e.g., "1,2,3"
        const userTimeZone = req.query.userTimeZone || "UTC";
        const stats = await Dashboard.getTodayTransactionStatsByPodiumIds(podiumIds, userTimeZone);

        return res.json({ stats });
    } catch (err) {
        return next(err);
    }
});
