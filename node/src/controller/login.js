const {exec, escape} = require('./../db/mysql.js')

const login = (username, password) => {
    username = escape(username)
    password = escape(password)
    const sql = `select username, realname from users where username=${username} and password=${password}`;
    return exec(sql).then(rows => {
        console.log(rows)
        return rows[0] || {}
    })
}
module.exports = {
    login
}