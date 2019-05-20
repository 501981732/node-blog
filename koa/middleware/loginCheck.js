const {ErrorModel} = require('../model/responseModel')

//统一登录验证中间件
const loginCheck = async (ctx,next) => {
    if (ctx.session.username) {
        await next()
        return
    }
    ctx.body = new ErrorModel('尚未登录')
}

module.exports = loginCheck