module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('Bot',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      platform: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Plataforma".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Plataforma".'
          }
        }
      },
      name: {
        type: DataTypes.INTEGER,
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
      description: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Descripción".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Descripción".'
          }
        }
      },
      token: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Por favor, rellena el campo "Token".'
          },
          notEmpty: {
            msg: 'Por favor, rellena el campo "Token".'
          }
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
      tableName: 'bots',
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

  Model.associate = function (models) {
    Model.hasMany(models.CustomerBot, { as: 'customerBots', foreignKey: 'botId' })
    Model.belongsToMany(models.Customer, { as: 'customers', through: models.CustomerBot, foreignKey: 'botId' })
  }

  return Model
}
