module.exports = (req, res, next) => {
  if (req.session?.customer?.id) return next()

  return res.status(401).send({
    redirection: '/cliente/login'
  })
}
