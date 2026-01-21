// // variable global que se lee de cualquier parte del proyecto. llamado basedir, y dirname
// // te devuelve en que carpeta se encuentra el archivo donde lanzas el comando
// // no confundir con .env (que es para el mismo uso) pero se usa como variable de entorno y no lo subimos a github porque tiene info sensible
// // el basedir es para que no se suba a github, y no tiene info sensible, solo la ruta del proyecto
// // variable global: es una variable que se puede leer desde cualquier parte del proyecto, no es necesario importarla, en cambio una de entorno: es necesario importarla
// global.__basedir = __dirname

// // la siguiente linea 'const app = require('./src/app')' es para importar el archivo app.js que se encuentra en la carpeta src, y que es el que contiene la configuracion del servidor
// // diferencia entre .require y .import: require es una funcion de nodejs que se usa para importar modulos fuera del entorno navegador, y .import es una funcion de javascript que se usa para importar modulos
// // en el entorno del navegador, pero no es compatible con nodejs, por eso usamos require
// const app = require('./src/app')
// // la siguiente linea 'const PORT = process.env.PORT || 8080' es para definir el puerto en el que va a correr el servidor, si no se encuentra definido en el archivo .env, se va a usar el puerto 8080 por defecto
// const PORT = process.env.PORT || 8080

// // app.listen(PORT, () => {console.log(`El servidor está corriendo en el puerto ${PORT} `)}) es para iniciar el servidor y escuchar en el puerto definido anteriormente, y si se inicia correctamente, se va a imprimir en consola el mensaje 'El servidor está corriendo en el puerto 8080'
// app.listen(PORT, () => {
//   console.log(`El servidor está corriendo en el puerto ${PORT} `)
// })

global.__basedir = __dirname

const app = require('./src/app')
const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`El servidor está corriendo en el puerto ${PORT} `)
})
