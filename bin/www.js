const http = require('http')

const userHandle = require('./../src/router/user')
const blogHandle = require('./../src/router/blog')
const querystring = require('querystring')
const server = http.createServer((req, res) => {
    serverHandle(req, res)
})

const serverHandle = (req, res) => {

    req.query = querystring.parse(req.url.split('?')[1])
    // 设置相应格式
    res.setHeader('Content-Type', 'application/json')
    getPostData(req).then(data => {
        req.body = data
        // 手动处理路由
        const blog = blogHandle(req, res)
        const user = userHandle(req, res)
        if (blog) {
            res.end(
                JSON.stringify(blog)
            )
            return
        } else if (user) {
            res.end(
                JSON.stringify(user)
            )
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
server.listen(8888, () => console.log('listen:8888'))