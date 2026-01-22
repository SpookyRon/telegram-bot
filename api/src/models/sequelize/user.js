module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Nombre".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Nombre".'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: {
            args: true,
            msg: 'Debe ser um e-mail válido'
          },
          notNull: {
            msg: 'Por favor, rellena el campo "Email".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Email".'
          }
        }
      },
      createdAt: {
        type: DataTypes.DATE,
        get () {
          return this.getDataValue('createdAt')
            ? this.getDataValue('createdAt').toISOString().split('T')[0]
            : null
        }
      },
      updatedAt: {
        type: DataTypes.DATE,
        get () {
          return this.getDataValue('updatedAt')
            ? this.getDataValue('updatedAt').toISOString().split('T')[0]
            : null
        }
      }
    }, {
      sequelize,
      tableName: 'users',
      timestamps: true,
      // modo paranoico, para que no se borren los datos, sino que se marquen como borrados
      // y se pueda recuperar la información
      paranoid: true,
      // indexes es una forma de acceder más rapido a los datos de la base de datos
      // porque ya están ordenados
      indexes: [
        {
          name: 'PRIMARY',
          unique: true,
          using: 'BTREE',
          fields: [
            { name: 'id' }
          ]
        }
      ]
    }
  )

  User.associate = function (Users) {
    User.hasOne(Users.UserCredential, { as: 'userCredential', foreignKey: 'userId' })
    User.hasMany(Users.UserActivationToken, { as: 'userActivationTokens', foreignKey: 'userId' })
    User.hasOne(Users.UserActivationToken, { as: 'userActivationToken', foreignKey: 'userId', scope: { used: false } })
    User.hasMany(Users.UserResetPasswordToken, { as: 'userResetPasswordTokens', foreignKey: 'userId' })
    User.hasOne(Users.UserResetPasswordToken, { as: 'userResetPasswordToken', foreignKey: 'userId', scope: { used: false } })
  }

  return User
}
