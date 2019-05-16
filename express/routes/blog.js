const express = require('express');
const router = express.Router()
const {SuccessModel,ErrorModel} = require('./../model/responseModel')
const {getList,getDetail,newBlog,updateBlog,deleteBlog} = require('../controller/blog')
const loginCheck = require('../middleware/loginCheck')
router.get('/list', (req,res,next) => {
    let {
        author = '',
        keywords = '',
    } = req.query
    //自己的管理界面
    if (req.query.isadmin) {
        // //登录验证
        if (!req.session.username) {
            res.json(
                new ErrorModel('未登录')
            )
            return
        }
        //强制查询自己的博客
        author = req.session.username
    }
    getList(author,keywords).then(listData => {
        if (listData) {
            // return new SuccessModel(listData)
            res.json(
                new SuccessModel(listData)
            )
        }
    }) 
})

router.get('/detail', (req,res,next) => {
    const {id} = req.query
    getDetail(id).then(data => {
        if (data) {
            res.json(
                new SuccessModel(data)
            )
        } else {
            res.json(
                new ErrorModel('查询失败')
            )
        }
    })
})

router.post('/new', loginCheck, (req,res,next) => {
        // 默认会带博客作者
        req.body.author = req.session.username
        newBlog(req.body).then(data => {
             res.json(
                new SuccessModel(data)
             )
        })
})

router.post('/update', loginCheck, (req,res,next) => {
    updateBlog(req.query.id,req.body).then(val => {
        if (val) {
            res.json(
                new SuccessModel(val,'更新成功')
            ) 
        } else {
            res.json(
                new ErrorModel(val,'更新失败')
            ) 
        }
    })
})

router.post('/delete', loginCheck, (req,res,next) => {
    req.body.author = req.session.username
    deleteBlog(req.query.id,req.body).then(val => {
        if (val) {
            res.json(
                new SuccessModel(val,'删除成功')
            )
        } else {
            res.json(
                new ErrorModel(val,'删除失败')
            )
        }
    })
})
module.exports = router