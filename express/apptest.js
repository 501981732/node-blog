const express = require('express')

// 本次 http 请求的实例
const app = express()

app.use((req,res,next) => {
    console.log('请求开始-', req.method,req.url)
    next()
})

// 假设在处理 cookie
app.use((req, res, next) => {
    req.cookie = {
        userId: 'abc123'
    }
    next()
})

// 异步处理body
app.use((req,res,next) => {
    setTimeout(() => {
        req.body = {
            a: 1
        }
        next()
    },10)
})

app.use('/api',(req,res,next) => {
    console.log('use  api 路由')
    next()
})

app.get('/api',(req,res,next) => {
    console.log('get  api 路由')
    next()
})

app.post('/api',(req,res,next) => {
    console.log('post  api 路由')
    next()
})
//异步登录验证
function loginCheck(req, res, next) {
    setTimeout(()=>{
        // res.json({
        //     status: -1,
        //     msg: '失败'
        // })
        // 模拟成功
        next()
    })
}

app.get('/api/get-cookie', loginCheck, (req, res, next) => {
    console.log('get /api/get-cookie')
    res.json({
        errno: 0,
        data: req.cookie
    })
})

app.post('/api/get-post-data', loginCheck, (req, res, next) => {
    console.log('post /api/get-post-data')
    res.json({
        errno: 0,
        data: req.body
    })
})


app.use((req, res, next) => {
    console.log('处理 404')
    res.json({
        errno: -1,
        msg: '404 not fount'
    })
})

app.listen(3001, () => {
    console.log('server is running on port 3001')
})

