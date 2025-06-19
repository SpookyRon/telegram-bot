const moment = require('moment')
const mongooseDb = require('../../models/mongoose')
const Faq = mongooseDb.Faq

exports.create = async (req, res, next) => {
  try {
    let data = await Faq.create(req.body)
    data = data.toObject()
    data.id = data._id

    res.status(200).send(data)
  } catch (err) {
    next(err)
  }
}

// abajo la paginacion y a partir de const whereStatement = {} es para filtrar los resultados
exports.findAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.size) || 10
    const offset = (page - 1) * limit
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }

    for (const key in req.query) {
      if (req.query[key] !== '' && req.query[key] !== 'null' && key !== 'page' && key !== 'size') {
        whereStatement[key] = { $regex: req.query[key], $options: 'i' }
      }
    }

    const result = await Faq.find(whereStatement)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()
      .exec()

    const count = await Faq.countDocuments(whereStatement)

    // preparar la respuesta
    const response = {
      rows: result.map(doc => ({
        ...doc,
        id: doc._id,
        _id: undefined,
        createdAt: moment(doc.createdAt).format('YYYY-MM-DD HH:mm'),
        updatedAt: moment(doc.updatedAt).format('YYYY-MM-DD HH:mm')
      })),
      meta: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page
      }
    }

    // devolver la respuesta
    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}

// buscar un dato por su id
exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await Faq.findById(id).lean().exec()

    if (!data) {
      const err = new Error()
      err.message = `No se puede encontrar el elemento con la id=${id}.`
      err.statusCode = 404
      throw err
    }

    data.id = data._id
    res.status(200).send(data)
  } catch (err) {
    next(err)
  }
}

// y actualizarlo con la palabra findByIdAndUpdate
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await Faq.findByIdAndUpdate(id, req.body, { new: true }).lean().exec()

    if (!data) {
      const err = new Error()
      err.message = `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado.`
      err.statusCode = 404
      throw err
    }

    res.status(200).send({
      message: 'El elemento ha sido actualizado correctamente.'
    })
  } catch (err) {
    next(err)
  }
}

// y eliminarlo con la palabra findByIdAndUpdate
// exports.delete = async (req, res, next) => { actualiza el campo deletedAt
exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await Faq.findByIdAndUpdate(id, { deletedAt: new Date() })

    if (!data) {
      const err = new Error()
      err.message = `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado.`
      err.statusCode = 404
      throw err
    }

    res.status(200).send({
      message: 'El elemento ha sido borrado correctamente.'
    })
  } catch (err) {
    next(err)
  }
}
