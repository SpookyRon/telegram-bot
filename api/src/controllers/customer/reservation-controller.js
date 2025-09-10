const mongooseDb = require('../../models/mongoose')
const Reservation = mongooseDb.Reservation

exports.findOne = async (req, res, next) => {
  try {
    const whereStatement = {}
    whereStatement.deletedAt = { $exists: false }
    whereStatement.name = req.params.name

    const response = await Reservation.findOne(whereStatement)
      .lean()
      .exec()

    res.status(200).send(response)
  } catch (err) {
    next(err)
  }
}
