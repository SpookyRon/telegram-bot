module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      title: String,
      description: String,
      buttonText: String,
      buttonLink: String,
      isActive: {
        type: Boolean,
        default: true
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Reservation = mongoose.model('Reservation', schema, 'reservations')

  return Reservation
}
