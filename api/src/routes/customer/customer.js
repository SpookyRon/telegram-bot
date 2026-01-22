const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/customer-controller.js')
const authCustomerCookie = require('../../middlewares/auth-customer-cookie.js')

router.post('/', controller.create)
router.get('/', [authCustomerCookie], controller.findAll)
router.get('/:id', [authCustomerCookie], controller.findOne)
router.put('/:id', [authCustomerCookie], controller.update)
router.delete('/:id', [authCustomerCookie], controller.delete)

module.exports = router
