module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      images: {
        type: mongoose.Schema.Types.Mixed
      },
      locales: {
        type: mongoose.Schema.Types.Mixed
      },
      items: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Card = mongoose.model('Card', schema, 'cards')
  return Card
}
