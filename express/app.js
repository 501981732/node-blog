var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');//日志
const ejs = require('ejs')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redisClient = require('./db/redis')
const {SESSION_SECRET_LEY} = require('./config/index.js')
const sessionStore = new RedisStore({
  client: redisClient,
})

//路由
var indexRouter = require('./routes/index');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

//本次http请求实例
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//启动视图引擎，并指定模板文件文件类型：ejs
app.set('view engine', 'ejs');

// //模板类型指定为html
// app.engine('html',ejs.__express)
// //启动视图引擎
// app.set('view engine','html')


app.use(logger('dev'));

app.use(express.json()); // post 处理body req.body
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(session({
  secret: SESSION_SECRET_LEY,
  resave: false, //添加 resave 选项
  saveUninitialized: true, //添加 saveUninitialized 选项
  cookie: {
    path: '/',   // 默认配置
    httpOnly: true,  // 默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore,
}))


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/blog',blogRouter)
app.use('/api/user',userRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
