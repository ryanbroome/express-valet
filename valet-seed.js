const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("./config");
const db = require("./db");

const users = [
    { username: "U1", password: "password", firstName: "U1F", lastName: "U1L", email: "U1@gmail.com", phone: "555-123-4567", totalParked: 0, isAdmin: "FALSE", locationId: 1 },
    { username: "U2", password: "password", firstName: "U2F", lastName: "U2L", email: "U2@gmail.com", phone: "555-123-4567", totalParked: 0, isAdmin: "FALSE", locationId: 2 },
    { username: "U3", password: "password", firstName: "U3F", lastName: "U3L", email: "U3@gmail.com", phone: "555-123-4567", totalParked: 0, isAdmin: "FALSE", locationId: 3 },
    { username: "U4", password: "password", firstName: "U4F", lastName: "U4L", email: "U4@gmail.com", phone: "555-123-4567", totalParked: 0, isAdmin: "FALSE", locationId: 2 },
    { username: "U5", password: "password", firstName: "U5F", lastName: "U5L", email: "U5@gmail.com", phone: "555-123-4567", totalParked: 0, isAdmin: "FALSE", locationId: 2 },
    { username: "U6", password: "password", firstName: "U6F", lastName: "U6L", email: "U6@gmail.com", phone: "555-123-4567", totalParked: 0, isAdmin: "FALSE", locationId: 2 },
    { username: "U7", password: "password", firstName: "U7F", lastName: "U7L", email: "U7@gmail.com", phone: "555-123-4567", totalParked: 0, isAdmin: "FALSE", locationId: 3 },
    { username: "U8", password: "password", firstName: "U8F", lastName: "U8L", email: "U8@gmail.com", phone: "555-123-4567", totalParked: 0, isAdmin: "FALSE", locationId: 3 },
    { username: "U9", password: "password", firstName: "U9F", lastName: "U9L", email: "U9@gmail.com", phone: "555-123-4567", totalParked: 0, isAdmin: "FALSE", locationId: 3 },
    { username: "testuser", password: "password", firstName: "test", lastName: "user", email: "testuser@gmail.com", phone: "555-123-4567", totalParked: 0, isAdmin: "TRUE", locationId: 3 },
];

async function seedUsers() {
    for (let user of users) {
        const hashedPassword = await bcrypt.hash(user.password, BCRYPT_WORK_FACTOR);
        await db.query(
            `UPDATE users
             SET password = $2,
                 first_name = $3,
                 last_name = $4,
                 email = $5,
                 phone = $6,
                 total_parked = $7,
                 is_admin = $8,
                 location_id = $9
             WHERE username = $1`,
            [user.username, hashedPassword, user.firstName, user.lastName, user.email, user.phone, user.totalParked, user.isAdmin, user.locationId]
        );
    }
    console.log("Users updated successfully!");
}

seedUsers();
