module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      name: String,
      items: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  const FeatureTitle = mongoose.model('FeatureTitle', schema, 'feature-titles')
  return FeatureTitle
}
