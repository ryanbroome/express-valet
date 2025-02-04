"use strict";

/** Express app for Park Pilot. */

const express = require("express");
const cors = require("cors");
// *
const path = require("path");
// *

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const vehiclesRoutes = require("./routes/vehicles");
const transactionRoutes = require("./routes/transactions");
const locationRoutes = require("./routes/locations");

const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/vehicles", vehiclesRoutes);
app.use("/transactions", transactionRoutes);
app.use("/locations", locationRoutes);

// *
app.use(express.static(path.join(__dirname + `client/build`)));
// *

/**  Handle 404 errors */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

// *
//  the "catchall" handler: for any request that doesn't match one above. send back React's index.html file
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + `/client/build/index.html`));
});
// *

//   Catch all generic error handler
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;
