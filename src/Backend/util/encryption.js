const crypto = require('crypto');

module.exports = function getRePassword(password) {

    let hashPassword = crypto.createHash('sha256');
    hashPassword.update(password);
    const rePassword = hashPassword.digest('hex');
    return rePassword;
}