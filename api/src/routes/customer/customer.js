const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/customer-controller.js')
const authCustomer = require('../../middlewares/auth-customer.js')

router.post('/', controller.create)
router.get('/', [authCustomer], controller.findAll)
router.get('/:id', [authCustomer], controller.findOne)
router.put('/:id', [authCustomer], controller.update)
router.delete('/:id', [authCustomer], controller.delete)

module.exports = router
