module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      locales: {
        type: mongoose.Schema.Types.Mixed
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const Hero = mongoose.model('Hero', schema, 'heroes')
  return Hero
}
