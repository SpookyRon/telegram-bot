const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/language-controller.js')
const authCookie = require('../../middlewares/auth-cookie.js')

router.post('/', [authCookie], controller.create)
router.get('/', [authCookie], controller.findAll)
router.get('/:id', [authCookie], controller.findOne)
router.put('/:id', [authCookie], controller.update)
router.delete('/:id', [authCookie], controller.delete)

module.exports = router
