const {exec, escape} = require('./../db/mysql.js')
const {crypto_password} = require('./../utils/crypto')
const login = async (username, password) => {
    username = escape(username)
    password = crypto_password(password)
    password = escape(password)
    const sql = `select username, realname from users where username=${username} and password=${password}`;
    const rows = await exec(sql)
    return rows[0] || {}
}
const check = async (username) => {
    const sql = `select username from users where username=${username}`
    const rows = await exec(sql)
    return rows[0] 
}
const register = async (username, password) => {
    username = escape(username)
    password = crypto_password(password)
    password = escape(password)
    const sql = `insert users (username, password) VALUES(${username},${password})`;
    const checkData = await check(username)
    console.log(checkData)
    if (checkData) {
        return {
            id: null,
            msg: '用户名已存在'
        }
    }
    const rows =  await exec(sql)
    return {
        id: rows.insertId,
        msg: '注册成功'
    }
    // return check(username).then(data => {
    //     if (data) {
    //         console.log('1',data)
    //         return {
    //             id: null,
    //             msg: '用户名已存在'
    //         }
    //     }
    //     return exec(sql).then(rows => {
    //         console.log('2',rows)
    //         return {
    //             id: rows.insertId,
    //             msg: '注册成功'
    //         }
    //     })
    // })
}

module.exports = {
    login,
    register
}