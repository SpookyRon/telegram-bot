module.exports = (err, req, res, next) => {
  console.error('🛑 Error capturado:', err)

  const statusCode = err.statusCode || 500
  const message = err.message || 'Ha ocurrido un error inesperado en el servidor.'

  res.status(statusCode).json({
    error: true,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

// este middleware se encarga de capturar los errores que ocurren en la aplicacion y enviarlos al cliente en formato json
// el err se ejecuta cuando hay un error en la aplicacion, y el next se encarga de pasar el error al siguiente middleware
// no se usa next en este caso porque no queremos pasar el error a otro middleware, sino que lo queremos manejar aqui
// osea no necesitas usar next porque con el error se acaba aqui la aplicacion
// si ves un res se acabó la aplicacion, no se va a ejecutar nada mas
