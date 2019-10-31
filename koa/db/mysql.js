const mysql = require('mysql');
const CONFIG = require('./../config/index.js');
// const connect = mysql.createConnection(CONFIG.MYSQL)

// 创建连接
// connect.connect()

// 创建连接池
const pool = mysql.createPool({connectionLimit : 10,...CONFIG.MYSQL})


pool.on('error', function(err) {
    throw new Error('db error')
})

//封装db操作

const exec = sql => {
    return new Promise((reslove,reject) => {
        pool.query(sql,(err,result) => {
            if (err) {
                reject(err)
            } else {
                reslove(result)
            }
            // 注意：一个事件就有一个从开始到结束的过程，数据库会话操作执行完后，就需要关闭掉，以免占用连接资源。
            connection.release()
        })
    })
}

module.exports = {
    exec,
    escape: mysql.escape
}
