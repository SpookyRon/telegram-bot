const sequelizeDb = require('../../models/sequelize')
const Bot = sequelizeDb.Bot

exports.findAll = async (req, res, next) => {
  try {
    const result = await Bot.findAll({
      attributes: ['id', 'name'],
      order: [['createdAt', 'DESC']]
    })

    res.status(200).send(result)
  } catch (err) {
    next(err)
  }
}
