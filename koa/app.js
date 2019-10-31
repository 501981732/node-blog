const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body');

const logger = require('koa-logger') // 本质是开发环境下 改变控制台console.log的格式 并非日志
const morgan = require('koa-morgan') //日志文件
const koaStatic = require('koa-static')
const path = require('path')
const fs = require('fs')
const CONFIG = require('./config/index.js');
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const errorHandler = require('./middleware/errorHandler')
const blog = require('./routes/blog')
const user = require('./routes/user')
const index = require('./routes/index')
// error handler
onerror(app)
// 配置 404 /错误500导致百度SEO降权
errorHandler.error(app)
// middlewares
// app.use(bodyparser({
//   enableTypes: ['json', 'form', 'text']
// }))
app.use(koaBody({
  multipart: true, //多文件
  formidable: {
    uploadDir: path.join(__dirname, 'public/upload/'), // 设置文件上传目录
    keepExtensions: true, // 保持文件的后缀
    maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
    onFileBegin: (name, file) => { // 文件上传前的设置
      // console.log(`name: ${name}`); //uploadFile
      // console.log(file);
    },
  }

}))
app.use(json())
app.use(logger())
// 静态资源
app.use(koaStatic(__dirname + '/public'))

// 模板引擎
// app.use(views(__dirname + '/views', {
//   extension: 'swig'
// }))
// 将html文件以swig引擎进行渲染
app.use(views(__dirname + '/views', {
  map: {
    html: 'swig'
  }
}))


// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 日志文件
if (process.env.NODE_ENV !== 'development') {
  console.log('生产环境配置日志记录')
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  }) //可写stream流
  app.use(morgan('combined', {
    stream: writeStream
  }));
} else {
  // :method :url :status :response-time ms - :res[content-length]
  app.use(morgan('dev'));
}

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