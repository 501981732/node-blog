const env = process.env.NODE_ENV
let CONFIG = {}
if (env === 'development') {
    CONFIG = {
        MYSQL: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '123456',
            database: 'myblog'
        },
        REDIS: {
            host: '6379',
            host: '127.0.0.1'
        }
    }
} else if (env === 'production') {
    CONFIG = {
        MYSQL: {

        }
    }    
} else {
    CONFIG = {
        MYSQL: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: '123456',
            database: 'myblog'
        },
        REDIS: {
            host: '6379',
            host: '127.0.0.1'
        }
    }
}

module.exports = CONFIG