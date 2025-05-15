module.exports = async (req, res, next) => {
  try {
    if (req.ip !== '::1') {
      const ip = req.ip.replace(/::ffff:/, '')
      const response = await fetch(`http://ip-api.com/json/${ip}`)

      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.status}`)
      }
      const data = await response.json()
      console.log(data)
      next()
    }
  } catch (error) {
    console.error('Error al obtener la IP:', error)
  }
}
