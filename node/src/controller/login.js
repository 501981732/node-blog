const exec = require('./../db/mysql.js')

const login = (username, password) => {
    // 假数据
    const sql = `select username, realname from users where username='${username}' and password='${password}'`;
    return exec(sql).then(rows => {
        console.log(rows)
        return rows[0] || {}
    })
}
module.exports = {
    login
}