const express = require('express')
const router = express.Router()

// cada una de las siguientes rutas sera un endpoint que tendra la API
// user para loggearse, y para registrarse, y para recuperar la contraseña, customer para el cliente, y admin para el administrador
router.use('/admin/users', require('./admin/users'))
router.use('/admin/customers', require('./admin/customers'))
router.use('/admin/bots', require('./admin/bots'))
router.use('/admin/faqs', require('./admin/faqs'))
router.use('/admin/eventCategories', require('./admin/eventCategories'))
router.use('/admin/promoters', require('./admin/promoters'))

module.exports = router
