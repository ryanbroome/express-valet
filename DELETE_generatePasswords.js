const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("./config");

const users = [
    { username: "valet10", password: "password" },
    { username: "valet11", password: "password" },
    { username: "valet12", password: "password" },
];

async function generateHashedPasswords() {
    for (let user of users) {
        const hashedPassword = await bcrypt.hash(user.password, BCRYPT_WORK_FACTOR);
        console.log(`Username: ${user.username}`, "======>", `Hashed PW: ${hashedPassword}`);
    }
}

generateHashedPasswords();
