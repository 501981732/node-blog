const {SuccessModel,ErrorModel} = require('./../model/responseModel')
const {getList,getDetail,newBlog,updateBlog,deleteBlog} = require('./../controller/blog')

const loginCheck = require('./../midware/loginCheck')

//返回promise
const handleBlog = ((req,res) => {
    const {method, url,} = req
    const path = url.split('?')[0]
    if (method === 'GET' && path === '/api/blog/list') {
        let {
            author = '',
            keywords = '',
        } = req.query
        //自己的管理界面
        if (req.query.isadmin) {
            console.log(111)
            //登录验证
            let loginResult = loginCheck(req);
            //未登录时 返回promise
            if (loginResult) {
                return loginResult
            }
            //强制查询自己的博客
            author = req.session.username
        }

        //返回promise
        return getList(author,keywords).then(listData => {
            if (listData) {
                return new SuccessModel(listData)
            }
        }) 
    }
    if (method === 'GET' && path === '/api/blog/detail') {
        const {id} = req.query
        return getDetail(id).then(data => {
            if (data) {
                return new SuccessModel(data)
            } else {
                return new ErrorModel('查询失败')
            }
        })
    }

    // 新建博客
    if (method === 'POST' && path === '/api/blog/new') {

        //登录验证
        let loginResult = loginCheck(req);
        //未登录时 返回promise
        if (loginResult) {
            return loginResult
        }

        // 默认会带博客作者
        req.body.author = req.session.username
        return newBlog(req.body).then(data => {
            return new SuccessModel(data)
        })
    }

    // 更新博客
    if (method === 'POST' && path === '/api/blog/update') {

        //登录验证
        let loginResult = loginCheck(req);
        if (loginResult) {
            return loginResult
        }

        return updateBlog(req.query.id,req.body).then(val => {
            if (val) {
                return new SuccessModel(val,'更新成功')
            } else {
                return new ErrorModel(val,'更新失败')
            }
        })
    }

    // 删除
    if (method === 'POST' && path === '/api/blog/delete') {

        //登录验证
        let loginResult = loginCheck(req);
        if (loginResult) {
            return loginResult
        }

        req.body.author = req.session.username
        return deleteBlog(req.query.id,req.body).then(val => {
            if (val) {
                return new SuccessModel(val,'删除成功')
            } else {
                return new ErrorModel(val,'删除失败')
            }
        })
    }

})

module.exports = handleBlog