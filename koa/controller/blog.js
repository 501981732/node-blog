const {exec, escape} = require('./../db/mysql.js')
const xss = require('xss')
const changeUploadPath = require('./../utils/changeUploadPath.js')
const getList = async (author,keywords,pageSize,pageNum) => {
    //黑科技 1=1
    let sql = `select * from blogs where 1=1`
    if (author) {
        sql += ` and author=${escape(author)}`
    } 
    if (keywords) {
        // keywords = escape(keywords)
        sql += ` and title like '%${keywords}%'`
    }
    let offset = (pageNum - 1) * pageSize
    sql+=` and status=1 order by createtime DESC limit ${offset},${pageSize}`

    return await exec(sql)
}

//获取博客数据
const getDetail = async (id) => {
    const sql = `select * from blogs where id='${id}'`
    const rows = await exec(sql)
    return rows[0]
    //返回的是数组 去掉数字
    // return exec(sql).then(rows => {
    //     return rows[0]
    // })
}
//新建博客创建的id
const newBlog = async (blogData = {}) => {
    let {author, title, content,files} = blogData
    let filesStr = ''
    if (Array.isArray(files)) {
        files.forEach((item,index) => {
            index && (filesStr +=  ",")
            filesStr +=  changeUploadPath(item.path)
        })
    } else {
        filesStr = changeUploadPath(files.path)
    }
    title = xss(title)
    content = xss(content)
    const createtime = Date.now()
    const sql = `insert blogs (title,content,author,createtime,files) VALUES(${escape(title)},${escape(content)},${escape(author)},${createtime},'${filesStr}')`
    console.log(sql)
    const insertData = await exec(sql)
    return {id: insertData.insertId}
    // return  exec(sql).then(insertData => {
    //     return {
    //         id: insertData.insertId //博客插入sql位置
    //     }
    // })
}

//更新博客信息
const updateBlog = async (id, blogData ={}) => {
    let {title, content} = blogData
    title = xss(title)
    content = xss(content)
    const createtime = Date.now()   
    const sql = `update blogs set title=${escape(title)}, content=${escape(content)} where id=${id}`
    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
    // return  exec(sql).then(data => {
    //     if (data.affectedRows >0) {
    //         return true
    //     }
    //     return false
    // })
}


// 删除博客信息
const deleteBlog = async (id,blogData) => {
    const {author} = blogData
    const createtime = Date.now()   
    // 业务删除
    //const sql = `delete from blogs where id='${id}' and author='${author}';`
    // 软删除
    const sql = `update blogs set status=0 where id=${id} and author=${escape(author)}`
    const delData = await exec(sql)
    if (delData.affectedRows > 0) {
        return true
    }
    return false
    // return  exec(sql).then(data => {
    //     if (data.affectedRows >0) {
    //         return true
    //     }
    //     return false
    // })
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}