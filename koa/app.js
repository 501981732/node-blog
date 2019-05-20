const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const blog = require('./routes/blog')
const user = require('./routes/user')
const index = require('./routes/index')

const CONFIG = require('./config/index.js');
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
// 静态资源
app.use(require('koa-static')(__dirname + '/public'))
// 模板
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// session redis配置
app.keys = [CONFIG.SESSION_SECRET_LEY]
app.use(session({
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },
  store: redisStore({
    all: `${CONFIG.REDIS.host}:${CONFIG.REDIS.port}`
  })
}))

// routes
app.use(index.routes(), index.allowedMethods())

app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
