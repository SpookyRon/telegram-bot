const express = require('express')
const router = express.Router()
const controller = require('../../controllers/customer/feature-title-controller.js')

router.get('/:name', controller.findOne)

module.exports = router
