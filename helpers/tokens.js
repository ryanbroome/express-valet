const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */
function createToken(user) {
    console.assert(user.role !== null, "createToken passed user without role property");

    let payload = {
        username: user.username,
        locationId: user.locationId,
        podiumId: user.podiumId,
        role: user.roleId || 1,
    };

    return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
