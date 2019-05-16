/*
 * useage 
  import expressLike = require('expressLike')
  const app = expressLike()
  app.use(cookieParser())
  app.use(cookieParser())
  app.get('/',indexRouter)
  app.post('/login',indexRouter)
  app.get('/api/get-cookie', loginCheck, (req, res, next) => {
    res.json({
        errno: 0,
        data: req.cookie
    })
})
    app.listen(8888,() => {
        
    })
*/
const http = require('http')
const slice = Array.prototype.slice
class ExpressLike {
    constructor() {
        // 存放各种方式中间件, 包含path和stack
        this.routes = {
            use: [
                // {
                //     path: '/',
                //     stack: xx
                // }
            ],
            get: [],
            post: [],
        }
    }

    register() {
        let info = {}
        // 第一个参数为字符串，则为局部中间件，否则为全局中间件
        if (typeof arguments[0] === 'string') {
            info.path = arguments[0]
            info.stack  = slice.call(arguments,1)
        } else {
            info.path = '/'
            info.stack  = slice.call(arguments,0)
        }
        return info
    }
    // 分别在各自方法中注册相应的中间件
    //this.routes.use = [
    //     {
    //         path: '/',
    //         stack: [cookieParse,checkLogin]
    //     },
    //     {
    //         path: '/api',
    //         stack: [checkLogin]
    //     }
    // ]
    use() {
        let info = this.register.apply(this, arguments)
        this.routes.use.push(info)
    }
    get() {
        let info = this.register.apply(this, arguments)
        this.routes.get.push(info)
    }
    post() {
        let info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }
    // 寻找对应匹配的中间件
    // 在相应的方法中 ，正则匹配路由 将对应路由的中间件注册进去
    match(method, url) {
        let stack = []
        if (url === '/favicon.ico') {
            return stack
        }
        let currentRoute = [...this.routes.use,...this.routes[method]]
        currentRoute.forEach(info => {
            // 应正则匹配
            if(url.indexOf(info.path) === 0) {
                // url='/api/blog/list' -> info.path= '/'
                // url='/api/blog/list' -> info.path= '/api'
                // url='/api/blog/list' -> info.path= '/api/api/blog/list'
                stack.push(...info.stack)
                console.log(stack)
            }
        })
        // 结果就是 每个对应路由 对应一个stack的中间件
        return stack
    }
    // next机制核心
    // 假如 [cookieParser,checkLogin,handleRouter]
    // 结合中间件写法理解
    // handle(req, res, stack) {
    //     const next = () => {
    //         // 拿到第一个中间件 执行
    //         const middleware = stack.shift()
    //         if (middleware) {
    //             // 传入 next中间件，使 中间件执行完毕后，递归调用自身
    //             middleware(req, res, next)
    //         }
    //     }
    //     next()
    // }

    handle(req, res, stack) {
        const next = (err) => {
            if (err) {
                return this.handle500(err,req,res,stack)
            }
            const middleware = stack.shift()
            if (middleware) {
                // 传入 next中间件，使 中间件执行完毕后，递归调用自身
                middleware(req, res, next)
            }
        }
        next()
    }

    handle404(req,res) {
        console.log(404)
        // res.end(404)
    }
    // 异常处理中间件
    handle500(err,req,res,stack) {
        stack = stack.filter(middleware => middleware.length === 4)
        const middleware = stack.shift()
        if (middleware) {
            // 传入 next中间件，使 中间件执行完毕后，递归调用自身
            middleware(err,req, res, next)
        }
    }
    // 统一处理处理
    callback() {
        return (req,res) => {
            res.json = (data) => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
            }
            const url = req.url
            const method = req.method.toLowerCase()
            // 当前路由对应的中间件
            const currentStack = this.match(method, url)
            if (currentStack.length) {
                this.handle(req, res, currentStack)
            } else {
                this.handle404(req,res)
            }
        }
    }
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}


// 工厂 
module.exports = () => {
    return new ExpressLike()
}


// const checkLogin = (req,res,next) => {
//     if (req.session.username) {
//         next()
//         return
//     }
//     res.json({
//         status: 0,
//         msg: '尚未登录'
//     })
// }

// 异常处理中间件
// const checkLogin = (req,res,next) => {
//  let id = req.cookie.sessionId
//  redisStore.get(id,(err,session){
//      if(err) {
//          return next(err)
//      }
//      req.session = session
//      next()
//  })
// }