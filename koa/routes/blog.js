const router = require('koa-router')()
const {SuccessModel,ErrorModel} = require('./../model/responseModel')
const {getList,getDetail,newBlog,updateBlog,deleteBlog} = require('../controller/blog')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

router.get('/list', async (ctx,next) => {
    let {
        author = '',
        keywords = '',
    } = ctx.query
    //自己的管理界面
    if (ctx.query.isadmin) {
        // //登录验证
        if (!ctx.session.username) {
            ctx.body = new ErrorModel('未登录')
            return
        }
        //强制查询自己的博客
        author = ctx.session.username
    }
    const listData = await getList(author,keywords)
    if (listData) {
        ctx.body = new SuccessModel(listData)
    }
})

router.get('/detail', async (ctx,next) => {
    const {id} = ctx.query
    const data = await getDetail(id)
    if (data) {
        ctx.body =  new SuccessModel(data)
    } else {
        ctx.body =  new ErrorModel('查询失败')
    }
})

router.post('/new', loginCheck, async (ctx,next) => {
        // 默认会带博客作者
        const body = ctx.request.body
        body.author = ctx.session.username
        const data = await newBlog(body)
        ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async (ctx,next) => {
    const data = await updateBlog(ctx.query.id,ctx.request.body)
        if (data) {
            ctx.body = new SuccessModel(val,'更新成功')
        } else {
            ctx.body = new ErrorModel(val,'更新失败')
        }
})

router.post('/delete', loginCheck, async (ctx,next) => {
    ctx.body.author = ctx.session.username
    const data = await deleteBlog(ctx.query.id,ctx.body)
    if (data) {
        ctx.body = new SuccessModel(val,'删除成功')
    } else {
        ctx.body =new ErrorModel(val,'删除失败')
    }
})
module.exports = router