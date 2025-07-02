const sequelizeDb = require('../../models/sequelize')
const EventCategory = sequelizeDb.EventCategory
const Op = sequelizeDb.Sequelize.Op

exports.create = async (req, res, next) => {
  try {
    const data = await EventCategory.create(req.body)
    res.status(200).send(data)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }
    next(err)
  }
}
// req.query es cuando pones un ? en la url, por ejemplo: http://localhost:3000/api/v1/admin/EventCategorys?name=Juan&age=30
exports.findAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.size) || 10
    const offset = (page - 1) * limit
    const whereStatement = {}

    for (const key in req.query) {
      if (req.query[key] !== '' && req.query[key] !== 'null' && key !== 'page' && key !== 'size') {
        whereStatement[key] = { [Op.substring]: req.query[key] }
      }
    }

    const condition = Object.keys(whereStatement).length > 0
      ? { [Op.and]: [whereStatement] }
      : {}

    const result = await EventCategory.findAndCountAll({
      where: condition,
      attributes: ['id', 'name', 'createdAt', 'updatedAt'],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    })

    result.meta = {
      total: result.count,
      pages: Math.ceil(result.count / limit),
      currentPage: page,
      size: limit
    }

    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}
// para hacer una llamada de post con finAll tengo que usar postman, y en el body tengo que poner el json que quiero enviar al servidor, y en el header tengo que poner el content-type: application/json, para que el servidor sepa que le estoy enviando un json, y no un string o un objeto de javascript
// los params los tienes que declarar en la ruta, por ejemplo: http://localhost:3000/api/v1/admin/EventCategorys/1
// para abrir el servidor en la consola tengo que usar el comando npm run dev, y para abrir el postman tengo que usar el comando npm run postman, y para abrir la aplicacion en el navegador tengo que usar el comando npm run start
exports.findOne = async (req, res, next) => {
  try {
    const id = req.params.id
    const data = await EventCategory.findByPk(id)

    if (!data) {
      const err = new Error()
      err.message = `No se puede encontrar el elemento con la id=${id}.`
      err.statusCode = 404
      throw err
    }

    res.status(200).send(data)
  } catch (err) {
    next(err)
  }
}
// req viene de llamada
// res viene de respuesta
exports.update = async (req, res, next) => {
  try {
    const id = req.params.id
    const [numberRowsAffected] = await EventCategory.update(req.body, { where: { id } })

    if (numberRowsAffected !== 1) {
      const err = new Error()
      err.message = `No se puede actualizar el elemento con la id=${id}. Tal vez no se ha encontrado.`
      err.statusCode = 404
      throw err
    }

    res.status(200).send({
      message: 'El elemento ha sido actualizado correctamente.'
    })
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      err.statusCode = 422
    }

    next(err)
  }
}
// async significa que la función es asincrona, es decir, que puede esperar a que se resuelva una promesa antes de continuar
// await significa que la función va a esperar a que se resuelva la promesa antes de continuar
exports.delete = async (req, res, next) => {
  try {
    const id = req.params.id
    const numberRowsAffected = await EventCategory.destroy({ where: { id } })

    if (numberRowsAffected !== 1) {
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

// que dos formas tenemos para enviar datos al servidor? los query y los params *examen*
// Redis es una base de datos en memoria, es decir, que almacena los datos en la memoria RAM y no en el disco duro. Esto hace que sea muy rápida, pero también significa que los datos se pierden cuando se apaga el servidor. Redis es muy útil para almacenar datos temporales o para hacer caché de datos que se usan con frecuencia. También se puede usar como base de datos principal, pero hay que tener en cuenta que los datos se perderán si el servidor se apaga. Redis es muy fácil de usar y tiene una gran cantidad de funciones avanzadas, como la posibilidad de almacenar listas, conjuntos y hashes. También tiene soporte para pub/sub, lo que permite enviar mensajes entre diferentes procesos. Redis es muy popular entre los desarrolladores y se usa en muchas aplicaciones web modernas.
// neo4j es una base de datos orientada a grafos, lo que significa que almacena los datos en forma de nodos y relaciones entre ellos. Esto hace que sea muy fácil de usar para almacenar datos que tienen una estructura jerárquica o que están relacionados entre sí. Neo4j es muy rápido y escalable, lo que lo hace ideal para aplicaciones web modernas. También tiene una gran cantidad de funciones avanzadas, como la posibilidad de hacer consultas complejas y de almacenar datos en tiempo real. Neo4j es muy popular entre los desarrolladores y se usa en muchas aplicaciones web modernas.
// mongoDB es una base de datos orientada a documentos, lo que significa que almacena los datos en forma de documentos JSON. Esto hace que sea muy fácil de usar para almacenar datos que tienen una estructura flexible o que cambian con frecuencia. MongoDB es muy rápido y escalable, lo que lo hace ideal para aplicaciones web modernas. También tiene una gran cantidad de funciones avanzadas, como la posibilidad de hacer consultas complejas y de almacenar datos en tiempo real. MongoDB es muy popular entre los desarrolladores y se usa en muchas aplicaciones web modernas.
// mysql es una base de datos relacional, lo que significa que almacena los datos en forma de tablas y filas. Esto hace que sea muy fácil de usar para almacenar datos que tienen una estructura fija o que no cambian con frecuencia. MySQL es muy rápido y escalable, lo que lo hace ideal para aplicaciones web modernas. También tiene una gran cantidad de funciones avanzadas, como la posibilidad de hacer consultas complejas y de almacenar datos en tiempo real. MySQL es muy popular entre los desarrolladores y se usa en muchas aplicaciones web modernas.
// postgresql es una base de datos relacional, lo que significa que almacena los datos en forma de tablas y filas. Esto hace que sea muy fácil de usar para almacenar datos que tienen una estructura fija o que no cambian con frecuencia. PostgreSQL es muy rápido y escalable, lo que lo hace ideal para aplicaciones web modernas. También tiene una gran cantidad de funciones avanzadas, como la posibilidad de hacer consultas complejas y de almacenar datos en tiempo real. PostgreSQL es muy popular entre los desarrolladores y se usa en muchas aplicaciones web modernas.

// si yo quiero cazar el idioma del usuario lo haria con middleware, y lo guardaria en el req, y luego lo usaria en el controller.
// se prepara el sitemap.xml y se le pasa el idioma al controller, y el controller lo guarda en la base de datos
