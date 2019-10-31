const router = require('koa-router')()
const {SuccessModel,ErrorModel} = require('./../model/responseModel')
const {login,register} = require('../controller/user')
router.prefix('/api/user')

router.post('/login', async (ctx, next) => {
  console.log(ctx.request.body)
  const { username, password } = ctx.request.body
  const data = await login(username, password)
  console.log(data)
  if (data.username) {
      //设置session
      ctx.session.username = data.username
      ctx.session.realname = data.realname
      // 同步到 redis
      // set_redis(req.sessionId, req.session
      ctx.body = new SuccessModel('登录成功')
      return    
  } else {
    ctx.body = new ErrorModel('登录失败')
  }
});

router.post('/register', async (ctx, next) => {
  const { username, password } = ctx.request.body
  const data = await register(username, password)
  if (data.id) {
    ctx.body = new SuccessModel(data.msg)
  } else {
    ctx.body = new ErrorModel(data.msg)
  }
})

router.get('/session', async function (ctx, next) {
  console.log(ctx.session)
  if (ctx.session.viewCount == null) {
    ctx.session.viewCount = 0
  }
  ctx.session.viewCount++
  ctx.body ={
    errno: 0,
    viewCount: ctx.session.viewCount
  }
})

module.exports = router
