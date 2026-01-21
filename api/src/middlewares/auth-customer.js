const jwt = require('jsonwebtoken')

/**
 * Verifica JWT de customer.
 * Espera: Authorization: Bearer <token>
 */
module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null

    if (!token) {
      return res.status(401).send({ redirection: '/login/customer' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.type !== 'customer' || !decoded.customerId) {
      return res.status(401).send({ redirection: '/login/customer' })
    }

    req.customerId = decoded.customerId
    next()
  } catch (err) {
    return res.status(401).send({ redirection: '/login/customer' })
  }
}
