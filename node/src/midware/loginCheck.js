const {ErrorModel} = require('./../model/responseModel')

//统一登录验证中间件
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
}

module.exports = loginCheck