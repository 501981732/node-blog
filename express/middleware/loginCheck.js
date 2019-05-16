const {ErrorModel} = require('../model/responseModel')

//统一登录验证中间件
const loginCheck = (req,res,next) => {
    if (req.session.username) {
        next()
        return
    }
    res.json(
        new ErrorModel('尚未登录')
    )
}

module.exports = loginCheck