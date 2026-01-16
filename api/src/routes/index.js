const express = require('express')
const router = express.Router()

// cada una de las siguientes rutas sera un endpoint que tendra la API
// user para loggearse, y para registrarse, y para recuperar la contraseña, customer para el cliente, y admin para el administrador
router.use('/admin/routes', require('./admin/routes'))

router.use('/admin/bots', require('./admin/bots'))
router.use('/admin/customer-bots', require('./admin/customer-bots'))
router.use('/admin/customers', require('./admin/customers'))
router.use('/admin/files', require('./admin/files'))
router.use('/admin/emails', require('./admin/emails'))
router.use('/admin/email-errors', require('./admin/email-errors'))

router.use('/admin/faqs', require('./admin/faqs'))
router.use('/admin/faqs-items', require('./admin/faqs-items'))
router.use('/customer/images', require('./customer/images'))

router.use('/admin/users', require('./admin/users'))
router.use('/admin/languages', require('./admin/languages'))
router.use('/admin/sent-emails', require('./admin/sent-emails'))

router.use('/admin/users', require('./admin/users'))
router.use('/admin/menus', require('./admin/menus'))
router.use('/admin/menu-items', require('./admin/menu-items'))
router.use('/admin/locale-seos', require('./admin/locale-seos'))
router.use('/admin/heroes', require('./admin/heroes'))
router.use('/admin/cards', require('./admin/cards'))
router.use('/admin/cards-items', require('./admin/cards-items'))
router.use('/admin/feature-titles', require('./admin/feature-titles'))
router.use('/admin/feature-title-items', require('./admin/feature-title-items'))

router.use('/admin/images', require('./admin/images'))

router.use('/customer/faqs', require('./customer/faqs'))
router.use('/customer/feature-titles', require('./customer/feature-titles'))
router.use('/customer/heroes', require('./customer/heroes'))
router.use('/customer/cards', require('./customer/cards'))
router.use('/customer/chats', require('./customer/chats'))

router.use('/auth', require('./auth/auth-activates'))
router.use('/auth/customer', require('./auth/customer-auth'))
router.use('/auth/user', require('./auth/auth-users'))

module.exports = router
