const express = require('express')
// express es un framework de nodejs que se usa para crear aplicaciones web y APIs, es el framework mas usado en nodejs, y es el que usamos para crear el servidor
// API es un conjunto de endpoints, rutas, urls, que se pueden usar para interactuar con la aplicacion, y es lo que vamos a crear en este proyecto

const app = express()
const userAgentMiddleware = require('./middlewares/user-agent')
const errorHandlerMiddleware = require('./middlewares/error-handler')
const userTrackingMiddleware = require('./middlewares/user-tracking')
const exposeServiceMiddleware = require('./middlewares/expose-service')
const IORedis = require('ioredis')

const redisClient = new IORedis(process.env.REDIS_URL)
const suscriberClient = new IORedis(process.env.REDIS_URL)
require('./events')(redisClient, suscriberClient)

app.use((req, res, next) => {
  req.redisClient = redisClient
  next()
})
// si llamo a la carpeta routes se ejecuta el index.js que se encuentra dentro de la carpeta routes, y si no existe, se ejecuta el archivo que se llama igual que la carpeta, en este caso routes.js
const routes = require('./routes')

// Los middlewares que tienen que funcionar antes de las rutas, se ejecutan antes de que se ejecute la ruta
// express.json es un middleware que hace que cada vez que recibes un json automaticamente lo convierte a un objeto de javascript, y lo guarda en la propiedad body del request, para que puedas usarlo en el controlador
app.use(express.json({ limit: '10mb', extended: true }))
app.use(userAgentMiddleware)
app.use(userTrackingMiddleware)
app.use(errorHandlerMiddleware)
app.use(...Object.values(exposeServiceMiddleware))

app.use('/api', routes)



module.exports = app
