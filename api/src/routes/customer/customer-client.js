const express = require('express')
const router = express.Router()

const authCustomerCookie = require('../../middlewares/auth-customer-cookie.js')

router.get('/profile', authCustomerCookie, (req, res) => {
  res.status(200).send({ logged: true, customerId: req.customerId })
})

module.exports = router
