const express = require('express')
const router = express.Router()

// cada una de las siguientes rutas sera un endpoint que tendra la API
// user para loggearse, y para registrarse, y para recuperar la contraseña, customer para el cliente, y admin para el administrador
router.use('/admin/users', require('./admin/users'))
router.use('/admin/customers', require('./admin/customers'))
router.use('/admin/bots', require('./admin/bots'))
router.use('/admin/faqs', require('./admin/faqs'))
router.use('/admin/customer-bots', require('./admin/customer-bots'))
router.use('/admin/customer-bots-chats', require('./admin/customer-bots-chats'))
router.use('/admin/customers', require('./admin/customers'))
router.use('/admin/emails', require('./admin/emails'))
router.use('/admin/sent-emails', require('./admin/sent-emails'))
router.use('/admin/languages', require('./admin/languages'))
router.use('/customer/customers', require('./customer/customer'))
router.use('/customer/customer-client', require('./customer/customer-client'))

router.use('/auth', require('./auth/auth-activates'))
router.use('/auth/user', require('./auth/auth-users'))
router.use('/auth/customer', require('./auth/auth-customers'))

module.exports = router
