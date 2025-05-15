// la libreria fs sirve para poder interactuar con nuestro sistema de archivos(file system)
const fs = require('fs')
// llamo a la libreria sequelize para poder interactuar con la base de datos
const Sequelize = require('sequelize')
// path es una libreria que me permite trabajar con rutas de archivos y directorios
// por ejemplo path.basename(__filename) me devuelve el nombre del archivo actual
const path = require('path')
const basename = path.basename(__filename)
const sequelizeDb = {}

// del const al }} le digo como se tiene que conectar a la base de datos
// sequelize usa una variable de entorno que es DATABASE_URL para conectarse a la base de datos, que se encuentran en el archivo .env
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {

  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

// del fs. al }) cargar los modelos del sequelize
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    )
  })

// cada vez que hago un require cargo cada modelo que tengo en la carpeta models/sequelize
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    sequelizeDb[model.name] = model
  })

// del Object al }) cargar los modelos y despues las relaciones que tienen entre ellos
Object.keys(sequelizeDb).forEach(modelName => {
  if (sequelizeDb[modelName].associate) {
    sequelizeDb[modelName].associate(sequelizeDb)
  }
})

// aqui se exporta para que los modelos puedan ser usados por los controladores
sequelizeDb.sequelize = sequelize
sequelizeDb.Sequelize = Sequelize

module.exports = sequelizeDb
