const Router = require('express')
const authController = require('../controller/auth_controller.js')
const router = new Router()
const {check} = require('express-validator')
const authMiddleware = require('../middlewares/auth_middleware')

router.post('/registration',[
    check('login', "Логин не должен быть пустым").notEmpty(),
    check('password', "Пароль не должен быть пустым").notEmpty()    
], authController.registration)
router.post('/login', authController.login)
router.post('/logout', authController.logout)
router.get('/activate/:link', authController.active)
router.get('/refresh', authController.refresh)
router.get('/users', authMiddleware, authController.getUsers)



module.exports = router