const mysql = require('mysql');
const CONFIG = require('./../config/index.js');
const connect = mysql.createConnection(CONFIG.MYSQL)

// 创建连接

connect.connect()


//封装db操作

const exec = sql => {
    const promise = new Promise((reslove,reject) => {
        connect.query(sql,(err,result) => {
            if (err) {
                reject(err)
            } else {
                reslove(result)
            }
        })
    })
    return promise
}

module.exports = exec