const {SuccessModule,ErrorModule} = require('./../module/responseModule')
const {login} = require('./../controller/Mocklogin')
const userHandle = (req,res) => {
    const {method, url} = req
    const query = url.split('?')[1]
    const path = url.split('?')[0]
    if (method === 'POST' && path === '/api/login') {
        const {username, password} = req.body
        let result = login(username,password)
        if (result) {
            return new SuccessModule(result,'登录成功')
        } else {
            return new ErrorModule(result,'登录失败')
        }
    }
}

module.exports = userHandle