const mongooseDb = require('../../models/mongoose')
const Faq = mongooseDb.Faqs

exports.findAll = async (req, res, next) => {
  try {
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }
    whereStatement.name = req.params.name

    const result = await Faq.findOne(whereStatement)
      .lean()
      .exec()

    const response = result.items[req.userLanguage].filter(item => !item.deletedAt)

    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}
