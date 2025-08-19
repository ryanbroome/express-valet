const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("./config");

const users = [{ username: "admin", password: "password" }];

async function generateHashedPasswords() {
    for (let user of users) {
        const hashedPassword = await bcrypt.hash(user.password, BCRYPT_WORK_FACTOR);
        console.log(`Username: ${user.username}`, "======>", `Hashed PW: ${hashedPassword}`);
    }
}

generateHashedPasswords();
