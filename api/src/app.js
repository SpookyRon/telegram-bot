const express = require('express')
// express es un framework de nodejs que se usa para crear aplicaciones web y APIs, es el framework mas usado en nodejs, y es el que usamos para crear el servidor
// API es un conjunto de endpoints, rutas, urls, que se pueden usar para interactuar con la aplicacion, y es lo que vamos a crear en este proyecto
const app = express()
const errorHandler = require('./middlewares/error-handler')
// si llamo a la carpeta routes se ejecuta el index.js que se encuentra dentro de la carpeta routes, y si no existe, se ejecuta el archivo que se llama igual que la carpeta, en este caso routes.js
const routes = require('./routes')

// express.json es un middleware que hace que cada vez que recibes un json automaticamente lo convierte a un objeto de javascript, y lo guarda en la propiedad body del request, para que puedas usarlo en el controlador
// un json se distingue por las comillas dobles y lo convertimos en un objeto de javascript para poder usarlo en el controlador, y no tener que estar convirtiendolo cada vez que lo recibimos
// y el limit es para limitar el tamaño del json que recibimos, en este caso 10mb, y extended es para que acepte objetos anidados, y no solo objetos planos
app.use(express.json({ limit: '10mb', extended: true }))

app.use(errorHandler)
app.use('/api', routes)

module.exports = app
