import blogController from './controller.js'

export const baseUrl = blogController.baseUrl
export default [{
    method:'GET',
    route:'/blog/list',// 根据作者，关键字查询
    handlers: [
        blogController.getBlog
    ]
},{
    method:'GET',
    route:'/blog',// 根据ID判断返回某一篇文章
    handlers: [
        blogController.getBlog
    ]
},{
    method:'POST',
    route:'/blog',// 创建博客
    handlers: [
        blogController.createBlog
    ]
},{
    method:'PUT',
    route:'/blog',// 修改博客
    handlers: [
        blogController.updateBlog
    ]
},{
    method:'DELETE',
    route:'/blog',// 删除博客
    handlers: [
        blogController.deleteBlog
    ]
},]