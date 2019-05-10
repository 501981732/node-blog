const {SuccessModule,ErrorModule} = require('./../module/responseModule')
const {getList,getDetail} = require('./../controller/blog')

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
        return {
            msg: '新建博客接口'
        }
    }
    if (method === 'POST' && path === '/api/blog/update') {
        return {
            msg: '更新博客接口'
        }
    }
    if (method === 'POST' && path === '/api/blog/delete') {
        return {
            msg: '删除博客接口'
        }
    }

})

module.exports = handleBlog