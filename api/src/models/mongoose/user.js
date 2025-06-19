module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      title: String,
      description: String,
      isActive: {
        type: Boolean,
        default: true
      },
      deletedAt: Date
    },
    { timestamps: true }
  )

  // el primer User corresponde al nombre del modelo, el segundo al nombre de la coleccion
  // y el tercero al nombre de la base de datos
  const User = mongoose.model('User', schema, 'users')
  return User
}
