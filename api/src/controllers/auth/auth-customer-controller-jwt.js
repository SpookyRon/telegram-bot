const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sequelizeDb = require('../../models/sequelize')

/**
 * POST /api/auth/customer/signin
 * Body: { email, password }
 *
 * Response (200): { token, redirection }
 */
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body || {}

    if (!email || !password) {
      return res.status(400).send({ message: 'Los campos no pueden estar vacíos.' })
    }

    const credential = await sequelizeDb.CustomerCredential.findOne({
      where: { email }
    })

    if (!credential) {
      return res.status(401).send({ message: 'Credenciales incorrectas.' })
    }

    const isValid = bcrypt.compareSync(password, credential.password)
    if (!isValid) {
      return res.status(401).send({ message: 'Credenciales incorrectas.' })
    }

    const customer = await sequelizeDb.Customer.findOne({
      where: { id: credential.customerId },
      attributes: ['id', 'name', 'email']
    })

    if (!customer) {
      return res.status(404).send({ message: 'Cliente no encontrado.' })
    }

    const token = jwt.sign(
      { type: 'customer', customerId: customer.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).send({
      token,
      redirection: '/customer/area',
      customer
    })
  } catch (err) {
    return res.status(500).send({ message: 'Error al iniciar sesión.' })
  }
}

/**
 * GET /api/auth/customer/check-signin
 * Header: Authorization: Bearer <token>
 */
exports.checkSignin = async (req, res) => {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null

    if (!token) {
      return res.status(401).send({ redirection: '/customer/login' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.type !== 'customer' || !decoded.customerId) {
      return res.status(401).send({ redirection: '/customer/login' })
    }

    return res.status(200).send({ redirection: '/customer/area' })
  } catch (err) {
    return res.status(401).send({ redirection: '/customer/login' })
  }
}

/**
 * GET /api/auth/customer/me
 * (protected)
 */
exports.me = async (req, res) => {
  try {
    const customer = await sequelizeDb.Customer.findOne({
      where: { id: req.customerId },
      attributes: ['id', 'name', 'email']
    })

    if (!customer) {
      return res.status(404).send({ message: 'Cliente no encontrado.' })
    }

    return res.status(200).send({ customer })
  } catch (err) {
    return res.status(500).send({ message: 'Error al cargar el perfil.' })
  }
}
