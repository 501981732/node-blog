const crypto = require('crypto');

const {PASSWORD_SECRET_LEY} = require('./../config/index.js')

const md5 = val => {
    let md5 = crypto.createHash('md5');
    return md5.update(val).digest('hex');
}

const crypto_password = (password) => {
    const str = `password=${password}&key=${PASSWORD_SECRET_LEY}`
    return md5(str)
}
module.exports = {
    crypto_password
}
