const redis = require('redis');
const CONFIG = require('./../config/index.js');
const client = redis.createClient(CONFIG.REDIS.port,CONFIG.REDIS.host)

client.on('error', err => {
    console.error("redis error", err)
})

const set_redis = (key, val) => {
    if (typeof val === 'object') {
        val = JSON.stringify(val)
    }
    client.set(key, val, redis.print);
}

const get_redis = (key) => {
    return new Promise((reslove,reject) => {
        client.get(key, function(err, val) {
            if (err) {
                reject(err)
            } 
            if (val == null) {
                reslove(null)
            }
            try {
                reslove(
                    JSON.parse(val)
                )
            } catch (err) {
                reject(err)
            }
        })
    })
}

module.exports = {
    set_redis,
    get_redis
}
