const userHandle = (req,res) => {
    const {method, url} = req
    const query = url.split('?')[1]
    const path = url.split('?')[0]
    if (method === 'POST' && path === '/api/login') {
        return {
            msg: '登录接口'
        }
    }
}

module.exports = userHandle