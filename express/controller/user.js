const {exec, escape} = require('./../db/mysql.js')
const {crypto_password} = require('./../utils/crypto')
const login = (username, password) => {
    username = escape(username)
    password = crypto_password(password)
    password = escape(password)
    const sql = `select username, realname from users where username=${username} and password=${password}`;
    return exec(sql).then(rows => {
        console.log(rows)
        return rows[0] || {}
    })
}
const check = (username) => {
    const sql = `select username from users where username=${username}`
    return exec(sql).then(row => {
        return row[0]
    })
}
const register = (username, password) => {
    username = escape(username)
    password = crypto_password(password)
    password = escape(password)
    const sql = `insert users (username, password) VALUES(${username},${password})`;
    return check(username).then(data => {
        if (data) {
            console.log('1',data)
            return {
                id: null,
                msg: '用户名已存在'
            }
        }
        return exec(sql).then(rows => {
            console.log('2',rows)
            return {
                id: rows.insertId,
                msg: '注册成功'
            }
        })
    })
    // return exec(sql).then(rows => {
    //     console.log(rows)
    //     return {
    //         id: rows.insertId
    //     }
    // })
}

module.exports = {
    login,
    register
}