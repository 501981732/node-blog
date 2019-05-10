const login = (username, password) => {
    // 假数据
    if (username === 'wangmeng' && password === '123456' ) {
        return true
    } else {
        return false
    }
}
module.exports = {
    login
}