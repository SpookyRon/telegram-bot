const express = require('express')
const router = express.Router()
const controller = require('../../controllers/admin/faq-controller.js')

router.post('/', controller.create)
router.get('/', controller.findAll)
router.get('/:id', controller.findOne)
// metodo put es para actualizar, y el id es el que se va a actualizar, y el body es lo que se va a actualizar
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

module.exports = router
