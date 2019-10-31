//KOA中间件原理解析
const http = require('http')
// 组合中间件
const compose = (middlewareList) => {
    return function(ctx) {
        function dispatch(i) {
            const fn = middlewareList[i]
            try {
                return Promise.resolve(
                    // next 机制
                    // dispatch.bind(null, i + 1) 相当于 中间件中的 next  假如 await next() 则会递归执行中间件
                    fn(ctx, dispatch.bind(null, i + 1)) // promise 经过包裹 保证返回promise对象
                )
            }
            catch (err) {
                return Promise.reject(err)
            }
        }
        return dispatch(0)
    }

}
class Koa2Like {
    constructor() {
        this.middlewareList = []
    }
    // 注册中间件
    use(fn) {
        this.middlewareList.push(fn)
        return this //链式调用
    }
    createCtx(req,res) {
        const ctx = {
            req,
            res
        }
        ctx.query = req.query
        // ...
        return ctx
    }
    handleRequest(ctx, fn) {
        return fn(ctx)
    }
    callback() {
        const fn = compose(this.middlewareList)
        return (req, res) => {
            const ctx = this.createCtx(req, res)
            return this.handleRequest(ctx, fn)
        }
    }
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

module.exports = Koa2Like