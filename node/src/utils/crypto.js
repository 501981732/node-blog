const crypto = require('crypto');

const SECRET_KEY = 'Wm_520000#'

const md5 = val => {
    let md5 = crypto.createHash('md5');
    return md5.update(val).digest('hex');
}

const crypto_password = (password) => {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}
module.exports = {
    crypto_password
}
