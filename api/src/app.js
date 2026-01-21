const express = require('express')
// express es un framework de nodejs que se usa para crear aplicaciones web y APIs, es el framework mas usado en nodejs, y es el que usamos para crear el servidor
// API es un conjunto de endpoints, rutas, urls, que se pueden usar para interactuar con la aplicacion, y es lo que vamos a crear en este proyecto

const app = express()
const errorHandlerMiddleware = require('./middlewares/error-handler')
const userAgentMiddleware = require('./middlewares/user-agent')
const userTrackingMiddleware = require('./middlewares/user-tracking')
const exposeServiceMiddleware = require('./middlewares/expose-service')

const { createClient } = require('redis')
const session = require('express-session')
const { RedisStore } = require('connect-redis')

const redisClient = createClient({ url: process.env.REDIS_URL })
redisClient.connect().catch(console.error)
const subscriberClient = redisClient.duplicate()
subscriberClient.connect().catch(console.error)

const sessionConfig = session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    domain: new URL(process.env.API_URL).hostname,
    path: '/',
    sameSite: 'Lax',
    maxAge: 1000 * 60 * 3600
  }
})

require('./events')(redisClient, subscriberClient)

app.use((req, res, next) => {
  req.redisClient = redisClient
  next()
})

const routes = require('./routes')

app.use(sessionConfig)
app.use(express.json({ limit: '10mb', extended: true }))
app.use(userTrackingMiddleware)
app.use(userAgentMiddleware)
app.use(...Object.values(exposeServiceMiddleware))

app.use('/api', routes)
app.use(errorHandlerMiddleware)

const customerRoutes = require('./routes/customer/customer.js')
app.use('/api/customer', customerRoutes)

module.exports = app
