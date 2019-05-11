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
        }
    }
}

module.exports = CONFIG