const exec = require('./../db/mysql.js')

const getList = (author,keywords) => {
    //黑科技 1=1
    let sql = `select * from blogs where 1=1`
    if (author) {
        sql += ` and author='${author}'`
    } 
    if (keywords) {
        sql += ` and title like '%${keywords}%'`
    }
    sql+=` and status=1 order by createtime DESC`
    return exec(sql)
}

//获取博客数据
const getDetail = id => {
    const sql = `select * from blogs where id='${id}'`
    //返回的是数组 去掉数字
    return exec(sql).then(rows => {
        return rows[0]
    })
}
//新建博客创建的id
const newBlog = (blogData = {}) => {
    const {author, title, content} = blogData
    const createtime = Date.now()
    const sql = `insert blogs (title,content,author,createtime) VALUES('${title}','${content}','${author}',${createtime})`
    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId //博客插入sql位置
        }
    })
}

//更新博客信息
const updateBlog = (id, blogData ={}) => {
    const {title, content} = blogData
    const createtime = Date.now()   
    const sql = `update blogs set title='${title}', content='${content}' where id=${id}`
    return exec(sql).then(data => {
        if (data.affectedRows >0) {
            return true
        }
        return false
    })

}


// 删除博客信息
const deleteBlog = (id,blogData) => {
    const {author} = blogData
    const createtime = Date.now()   
    // 业务删除
    //const sql = `delete from blogs where id='${id}' and author='${author}';`
    // 软删除
    const sql = `update blogs set status=0 where id=${id} and author='${author}'`
    return exec(sql).then(data => {
        if (data.affectedRows >0) {
            return true
        }
        return false
    })
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}