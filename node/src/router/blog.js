const {SuccessModule,ErrorModule} = require('./../module/responseModule')
const {getList,getDetail,newBlog,updataBlog,deleteBlog} = require('./../controller/blog')

const handleBlog = ((req,res) => {
    const {method, url,} = req
    const path = url.split('?')[0]
    if (method === 'GET' && path === '/api/blog/list') {
        const {
            author = '',
            keywords = '',
        } = req.query
        const listData = getList(author,keywords)
        return new SuccessModule(listData)
    }
    if (method === 'GET' && path === '/api/blog/detail') {
        const {id} = req.query
        return new SuccessModule(getDetail(id))
    }
    if (method === 'POST' && path === '/api/blog/new') {
        console.log(req.body)
        return new SuccessModule(newBlog(req.body))
    }
    if (method === 'POST' && path === '/api/blog/update') {
        const result = updataBlog(req.query.id,req.body)
        if (result) {
            return new SuccessModule(result)
        } else {
            return new ErrorModule(false)
        }
    }
    if (method === 'POST' && path === '/api/blog/delete') {
        const result = deleteBlog(req.query.id)
        if (result) {
            return new SuccessModule(result,'删除成功')
        } else {
            return new ErrorModule(false,'删除失败')
        }
    }

})

module.exports = handleBlog