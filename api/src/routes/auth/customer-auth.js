const express = require('express')
const router = express.Router()

const controller = require('../../controllers/auth/auth-customer-controller-jwt')
const authCustomer = require('../../middlewares/auth-customer')

router.post('/signin', controller.signin)
router.get('/check-signin', controller.checkSignin)
router.get('/me', authCustomer, controller.me)

module.exports = router
