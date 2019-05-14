const http = require('http')

const userHandle = require('./../src/router/user')
const blogHandle = require('./../src/router/blog')
const querystring = require('querystring')
const server = http.createServer((req, res) => {
    serverHandle(req, res)
})
const {get_redis, set_redis} = require('./../src/db/redis')

// session数据 
const SESSION_DATA = {
    // userId: {
    //     username: 'xxx',
    //     realname: 'xxx'
    // },
    // userId: {
    //     username: 'xxx',
    //     realname: 'xxx'
    // },
}

const serverHandle = (req, res) => {

    // 解析query
    req.query = querystring.parse(req.url.split('?')[1])

    //解析cookie
    req.cookie = {}
    const cookieString = req.headers.cookie || ''
    cookieString.split(';').forEach(item => {
        if(!item) return 
        const arr = item.split('=')
        req.cookie[arr[0].trim()] = arr[1]
    })
    // 解析session
    let needSessionCookie = false //需要这是sessioncookie
    let userId = req.cookie.userId
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        } 
    } else {
        // cookie中没有 sessionId 生成。并需要在cookie中设置
        needSessionCookie = true
        userId = Date.now() + '_' + Math.random() //随机数
        SESSION_DATA[userId] = {}
    }
    //设置sessionId或者生产sessionId
    req.session = SESSION_DATA[userId]

    // 设置相应格式
    res.setHeader('Content-Type', 'application/json')
    getPostData(req).then(data => {
        req.body = data
        // 手动处理路由 路由返回的是promise
        const blogResult = blogHandle(req, res)
        const userResult = userHandle(req, res)
        if (blogResult) {
            blogResult.then(blog => {
                if (needSessionCookie) {
                    res.setHeader('Set-Cookie',`userId=${userId}; path=/; httpOnly; expires=${cookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blog)
                )
            }).catch(err => {
                console.log('err',err)
            })
            return
        }  
        if (userResult) {
            userResult.then(user => {
                if (needSessionCookie) {
                    res.setHeader('Set-Cookie',`userId=${userId}; path=/; httpOnly; expires=${cookieExpires()}`)
                }
                res.end(
                    JSON.stringify(user)
                )
            })
            return
        }
        res.writeHead(404, { 'Conttype-Type': 'text/plain' })
        res.write('404 Not Found')
        res.end()
    })
}

// 手动处理post数据
const getPostData = (req) => {
    return new Promise((reslove, reject) => {
        if (req.method === 'POST') {
            let postData = ''
            req.on('data', (chunk) => {
                postData += chunk.toString()
            })

            req.on('end', () => {
                if (!postData) {
                    reslove({})
                    return
                }
                reslove(
                    JSON.parse(postData)
                )
                return
            })
        } else {
            reslove({})
        }
    })
}

const cookieExpires = () => {
    let d = new Date();
    d.setTime(d.getTime() + 20*60*1000)
    return d.toGMTString()
}

server.listen(8888, () => console.log('listen:8888'))