const http = require('http')
const querystring = require('querystring')
const server = http.createServer(function(req,res) {
    const url = req.url
    const query = querystring.parse(url.split('?')[1])
    // 处理post请求
    if (req.method === 'POST') {
        let postData = ''
        req.on('data',(chunk)=>{
            postData += chunk
        })
        req.on('end',()=>{
            console.log(postData)
            console.log(req.headers['content-type'])
            // 设置返回格式
            res.setHeader('Content-Type','application/json')
            let result = {
                method: req.method,
                url: req.url,
                body: postData,
                query
            }
            res.end(JSON.stringify(result))
        })
        //处理get请求
    } else if (req.method === 'GET') {
        let result = {
            method: req.method,
            url: req.url,
            query
        }
        res.end(JSON.stringify(result))
    }
})

server.listen(8888,() => {
    console.log('listen on 8888')
})
