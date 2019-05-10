import user from './../../models/user.js'
import Base from './../../prototype/base.js'

import bcrypt from 'bcrypt'
const saltRounds = 10
class Login extends Base {
    constructor(args) {
        super(args)
        this.baseUrl = '/api'
    }
    async register(ctx, next) {
        let { username, password } = ctx.request.body
        let res = await user.find({ username })
        if (res.length) {
            ctx.body = {
                status: 0,
                message: '该名称已被注册'
            }
            return
        }
        if (!username) {
            ctx.body = {
                status: 0,
                message: '请填写名字',
            }
            return
        }
        if (!password) {
            ctx.body = {
                status: 0,
                message: '请填写密码',
            }
            return
        }
        let hashPSW = await bcrypt.hash(password, saltRounds)

        const newUser = new user({
            username,
            password: hashPSW
        })
        try {
            await newUser.save()
            console.log('添加成功')
            ctx.body = {
                status: 1,
                message: 'success'
            }
        } catch (err) {
            err === 404 ? ctx.throw(404) : ctx.throw(500)
        }
    }


    async login(ctx, next) {
        const {username,password} = ctx.request.body
        if (!username) {
            ctx.body = {
                status: 0,
                message: '请输入账号'
            }
        }
        let res = await user.find({ username })
        console.log(res)
        if (!res.length) {
            ctx.body = {
                status: 0,
                message: '请输入正确的账号'
            }
        } else {
            let match = await bcrypt.compare(password, res[0].password)
            if (match) {
                ctx.body = {
                    status: 1,
                    message: '登录成功'
                }
            } else {
                ctx.body = {
                    status: 1,
                    message: '请输入正确的密码'
                }
            }
        }
        if (!password) {
            ctx.body = {
                status: 0,
                message: '请输入密码'
            }
        }

    }

    async loginList(ctx, next) {
        try {
            let res = await user.find({})
            if (res) {
                ctx.body = {
                    status: 1,
                    result: res,
                    message: 'success'
                }
            } else {
                ctx.body = {
                    status: 1,
                    result: [],
                    message: 'success'
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
}

export default new Login()