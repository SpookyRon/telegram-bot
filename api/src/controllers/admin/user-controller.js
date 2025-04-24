exports.create = (req, res) => {
  console.log(req.body)
  res.send('POST request to the homepage')
}
// req.query es cuando pones un ? en la url, por ejemplo: http://localhost:3000/api/v1/admin/users?name=Juan&age=30
exports.findAll = (req, res) => {
  res.send('GET request to the homepage')
}
// para hacer una llamada de post con finAll tengo que usar postman, y en el body tengo que poner el json que quiero enviar al servidor, y en el header tengo que poner el content-type: application/json, para que el servidor sepa que le estoy enviando un json, y no un string o un objeto de javascript
// los params los tienes que declarar en la ruta, por ejemplo: http://localhost:3000/api/v1/admin/users/1
// para abrir el servidor en la consola tengo que usar el comando npm run dev, y para abrir el postman tengo que usar el comando npm run postman, y para abrir la aplicacion en el navegador tengo que usar el comando npm run start
exports.findOne = (req, res) => {
  console.log(req.params.id)
  res.send('GET request to the homepage')
}
// req viene de llamada
// res viene de respuesta
exports.update = (req, res) => {
  console.log(req.params.id)
  console.log(req.body)
  res.send('PUT request to the homepage')
}
// async significa que la función es asincrona, es decir, que puede esperar a que se resuelva una promesa antes de continuar
// await significa que la función va a esperar a que se resuelva la promesa antes de continuar
exports.delete = (req, res) => {
  console.log(req.params.id)
  res.send('DELETE request to the homepage')
}

// que dos formas tenemos para enviar datos al servidor? los query y los params *examen*
// Redis es una base de datos en memoria, es decir, que almacena los datos en la memoria RAM y no en el disco duro. Esto hace que sea muy rápida, pero también significa que los datos se pierden cuando se apaga el servidor. Redis es muy útil para almacenar datos temporales o para hacer caché de datos que se usan con frecuencia. También se puede usar como base de datos principal, pero hay que tener en cuenta que los datos se perderán si el servidor se apaga. Redis es muy fácil de usar y tiene una gran cantidad de funciones avanzadas, como la posibilidad de almacenar listas, conjuntos y hashes. También tiene soporte para pub/sub, lo que permite enviar mensajes entre diferentes procesos. Redis es muy popular entre los desarrolladores y se usa en muchas aplicaciones web modernas.
// neo4j es una base de datos orientada a grafos, lo que significa que almacena los datos en forma de nodos y relaciones entre ellos. Esto hace que sea muy fácil de usar para almacenar datos que tienen una estructura jerárquica o que están relacionados entre sí. Neo4j es muy rápido y escalable, lo que lo hace ideal para aplicaciones web modernas. También tiene una gran cantidad de funciones avanzadas, como la posibilidad de hacer consultas complejas y de almacenar datos en tiempo real. Neo4j es muy popular entre los desarrolladores y se usa en muchas aplicaciones web modernas.
// mongoDB es una base de datos orientada a documentos, lo que significa que almacena los datos en forma de documentos JSON. Esto hace que sea muy fácil de usar para almacenar datos que tienen una estructura flexible o que cambian con frecuencia. MongoDB es muy rápido y escalable, lo que lo hace ideal para aplicaciones web modernas. También tiene una gran cantidad de funciones avanzadas, como la posibilidad de hacer consultas complejas y de almacenar datos en tiempo real. MongoDB es muy popular entre los desarrolladores y se usa en muchas aplicaciones web modernas.
// mysql es una base de datos relacional, lo que significa que almacena los datos en forma de tablas y filas. Esto hace que sea muy fácil de usar para almacenar datos que tienen una estructura fija o que no cambian con frecuencia. MySQL es muy rápido y escalable, lo que lo hace ideal para aplicaciones web modernas. También tiene una gran cantidad de funciones avanzadas, como la posibilidad de hacer consultas complejas y de almacenar datos en tiempo real. MySQL es muy popular entre los desarrolladores y se usa en muchas aplicaciones web modernas.
// postgresql es una base de datos relacional, lo que significa que almacena los datos en forma de tablas y filas. Esto hace que sea muy fácil de usar para almacenar datos que tienen una estructura fija o que no cambian con frecuencia. PostgreSQL es muy rápido y escalable, lo que lo hace ideal para aplicaciones web modernas. También tiene una gran cantidad de funciones avanzadas, como la posibilidad de hacer consultas complejas y de almacenar datos en tiempo real. PostgreSQL es muy popular entre los desarrolladores y se usa en muchas aplicaciones web modernas.

// si yo quiero cazar el idioma del usuario lo haria con middleware, y lo guardaria en el req, y luego lo usaria en el controller.
// se prepara el sitemap.xml y se le pasa el idioma al controller, y el controller lo guarda en la base de datos
