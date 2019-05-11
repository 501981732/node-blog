const {SuccessModel,ErrorModel} = require('./../model/responseModel')
const {getList,getDetail,newBlog,updateBlog,deleteBlog} = require('./../controller/blog')

//返回promise
const handleBlog = ((req,res) => {
    const {method, url,} = req
    const path = url.split('?')[0]
    if (method === 'GET' && path === '/api/blog/list') {
        const {
            author = '',
            keywords = '',
        } = req.query
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
    if (method === 'POST' && path === '/api/blog/new') {
        // 默认会带博客作者
        req.body.author = 'wangmeng'
        return newBlog(req.body).then(data => {
            return new SuccessModel(data)
        })
    }
    if (method === 'POST' && path === '/api/blog/update') {
        return updateBlog(req.query.id,req.body).then(val => {
            if (val) {
                return new SuccessModel(val,'更新成功')
            } else {
                return new ErrorModel(val,'更新失败')
            }
        })
    }
    if (method === 'POST' && path === '/api/blog/delete') {
        req.body.author = 'wangmeng'
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