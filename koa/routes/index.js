const router = require('koa-router')()

router.get('/index.html', async (ctx, next) => {
  console.log('index')
  await ctx.render('index', {
    title: 'Hello 二手交易网!'
  })
})
router.get('/', async (ctx, next) => {
  console.log('index')
  await ctx.render('index', {
    title: 'Hello 二手交易网!'
  })
})

router.get('/detail.html', async (ctx, next) => {
  await ctx.render('detail')
})
router.get('/admin.html', async (ctx, next) => {
//   if (ctx.query.isadmin) {
//     // //登录验证
//     if (!ctx.session.username) {
//         // ctx.body = new ErrorModel('未登录')
//         ctx.redirect('/login.html');
//         // ctx.status = 301;
//         return
//     }
// }
  await ctx.render('admin')
})
router.get('/edit.html', async (ctx, next) => {
  await ctx.render('edit')
})
router.get('/new.html', async (ctx, next) => {
  await ctx.render('new')
})
router.get('/login.html', async (ctx, next) => {
  await ctx.render('login')
})

router.get('/err', async (ctx, next) => {
  throw new Error('我错了')
})

module.exports = router
