const { v4 } = require('uuid');
//verify = VERIFY_ACCOUNT
//forget password = CHANGE_PASSWORD
const TOKEN_PREFIXES = {
    VERIFY_ACCOUNT: "VERIFY_ACCOUNT",
    CHANGE_PASSWORD: "CHANGE_PASSWORD"
}
const generateToken = async (prefix = "") => {
    const token = await v4();
    return prefix + "-" + token;
}

module.exports = {
    generateToken,
    TOKEN_PREFIXES
}