const env = process.env.NODE_ENV
let CONFIG = {}
if (env === 'development') {
    CONFIG = {
        MYSQL: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: 'root',
            database: 'myblog'
        },
        REDIS: {
            port: '6379',
            host: '127.0.0.1'
        },
        PORT: '8081',
        PASSWORD_SECRET_LEY: 'Wm_520000#',
        SESSION_SECRET_LEY: 'Wamdfnsd13%7#'
    }
} else if (env === 'production') {
    CONFIG = {
        MYSQL: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: 'root',
            database: 'myblog'
        },
        REDIS: {
            port: '6379',
            host: '127.0.0.1' 
        },
        PORT: '8081',
        PASSWORD_SECRET_LEY: 'Wm_520000#',
        SESSION_SECRET_LEY: 'Wamdfnsd13%7#'
    }
} else {
    CONFIG = {
        MYSQL: {
            host: 'localhost',
            port: '3306',
            user: 'root',
            password: 'root',
            database: 'myblog'
        },
        REDIS: {
            port: '6379',
            host: '127.0.0.1'
        },
        PORT: '8081',
        PASSWORD_SECRET_LEY: 'Wm_520000#',
        SESSION_SECRET_LEY: 'Wamdfnsd13%7#'
    }
}

module.exports = CONFIG