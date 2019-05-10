import loginController from './controller.js'

export const baseUrl = loginController.baseUrl

export default [{
    method: 'POST',
    route: '/register',
    handlers: [
    loginController.register
    ]
},{
    method: 'POST',
    route: '/login',
    handlers: [
    loginController.login
    ]
},{
    method: 'GET',
    route: '/login',
    handlers: [
    loginController.loginList
    ]
}]
