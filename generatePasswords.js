const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../valet_back_end/config");

const users = [
    { username: "U1", password: "password" },
    { username: "U2", password: "password" },
    { username: "U3", password: "password" },
    { username: "U4", password: "password" },
    { username: "U5", password: "password" },
    { username: "U6", password: "password" },
    { username: "U7", password: "password" },
    { username: "U8", password: "password" },
    { username: "U9", password: "password" },
    { username: "testuser", password: "password" },
];

async function generateHashedPasswords() {
    for (let user of users) {
        const hashedPassword = await bcrypt.hash(user.password, BCRYPT_WORK_FACTOR);
        console.log(`${user.username}`, `${hashedPassword}`);
    }
}

generateHashedPasswords();
