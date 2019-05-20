var express = require('express');
var router = express.Router();
const { SuccessModel, ErrorModel } = require('../model/responseModel')
const { login, register } = require('./../controller/user')

router.post('/login', function(req, res, next) {
    const { username, password } = req.body
    return login(username, password).then(data => {
        if (data.username) {
            //设置session
            req.session.username = data.username
            req.session.realname = data.realname
            // 同步到 redis
            // set_redis(req.sessionId, req.session)
            res.json(
                new SuccessModel('登录成功')
            )
            return
        }
        res.json(
            new ErrorModel('登录失败')
        )
    })
});

router.post('/register', function(req, res, next) {
    const { username, password } = req.body
    return register(username, password).then(data => {
        if (data.id) {
            return new SuccessModel(data.msg)
        }
        return new ErrorModel(data.msg)
    })
})
// router.get('/session-test', (req, res, next) => {
//     const session = req.session
//     if (session.viewNum == null) {
//         session.viewNum = 0
//     }
//     session.viewNum++

//     res.json({
//         viewNum: session.viewNum
//     })
// })
module.exports = router;