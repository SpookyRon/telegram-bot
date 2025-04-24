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
