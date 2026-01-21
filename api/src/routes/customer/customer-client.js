const express = require('express')
const router = express.Router()

const authCustomer = require('../../middlewares/auth-customer.js')

router.get('/me', authCustomer, (req, res) => {
  // auth-customer.js puso req.customerId
  res.status(200).send({ logged: true, customerId: req.customerId })
})

module.exports = router
