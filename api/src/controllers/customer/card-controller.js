const mongooseDb = require('../../models/mongoose')
const Card = mongooseDb.Card

exports.findOne = async (req, res, next) => {
  try {
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }
    whereStatement.name = req.params.name

    const result = await Card.findOne(whereStatement)
      .lean()
      .exec()

    const response = {
      title: result.locales[req.userLanguage].title,
      description: result.locales[req.userLanguage].description,
      cards: result.items[req.userLanguage].filter(item => !item.deletedAt),
      images: result.images ? result.images : []
    }

    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}
