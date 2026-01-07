const express = require('express')
const router = express.Router()
const controller = require('../../controllers/customer/image-controller.js')

router.get('/image/:filename', controller.getImage)
router.get('/:collection/:folder/:filename', controller.getCollectionImage)

module.exports = router
