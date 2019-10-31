const router = require('koa-router')()
const {SuccessModel,ErrorModel} = require('./../model/responseModel')
const {getList,getDetail,newBlog,updateBlog,deleteBlog} = require('../controller/blog')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')

router.get('/list', async (ctx,next) => {
    let {
        author = '',
        keywords = '',
        pageSize = 10,
        pageNum = 1
    } = ctx.query
    //自己的管理界面
    if (ctx.query.isadmin) {
        // //登录验证
        if (!ctx.session.username) {
            ctx.body = new ErrorModel('未登录')
            // ctx.redirect('/login.html');
            // ctx.status = 301;
            return
        }
        //强制查询自己的博客
        author = ctx.session.username
    }
    const listData = await getList(author,keywords,pageSize,pageNum)
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
    const files = ctx.request.files.uploadFile; // 获取上传文件
    // for (let file of files) {
    //   // 创建可读流
    //   const reader = fs.createReadStream(file.path);
    //   // 获取上传文件扩展名
    //   let filePath = path.join(__dirname, 'public/upload/') + `/${file.name}`;
    //   // 创建可写流
    //   const upStream = fs.createWriteStream(filePath);
    //   // 可读流通过管道写入可写流
    //   reader.pipe(upStream);
    // }
    console.log('.....',ctx)
        // 默认会带博客作者
        const body = ctx.request.body
        body.author = ctx.session.username
        body.files = files
        const data = await newBlog(body)
        ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async (ctx,next) => {
    const data = await updateBlog(ctx.query.id,ctx.request.body)
        if (data) {
            ctx.body = new SuccessModel(data,'更新成功')
        } else {
            ctx.body = new ErrorModel(data,'更新失败')
        }
})

router.post('/delete', loginCheck, async (ctx,next) => {
    ctx.request.body.author = ctx.session.username
    const data = await deleteBlog(ctx.query.id,ctx.request.body)
    if (data) {
        ctx.body = new SuccessModel(data,'删除成功')
    } else {
        ctx.body =new ErrorModel(data,'删除失败')
    }
})

module.exports = router