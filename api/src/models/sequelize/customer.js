module.exports = function (sequelize, DataTypes) {
  const Customer = sequelize.define('Customer',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      prefix: {
        type: DataTypes.STRING,
        allowNull: true
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: true
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
      tableName: 'customers',
      timestamps: true,
      paranoid: true,
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

  Customer.associate = function (Customers) {
    Customer.hasOne(Customers.CustomerCredential, { as: 'customerCredential', foreignKey: 'customerId' })
    Customer.hasMany(Customers.CustomerActivationToken, { as: 'customerActivationTokens', foreignKey: 'customerId' })
    Customer.hasOne(Customers.CustomerActivationToken, { as: 'customerActivationToken', foreignKey: 'customerId', scope: { used: false } })
    Customer.hasMany(Customers.CustomerResetPasswordToken, { as: 'customerResetPasswordTokens', foreignKey: 'customerId' })
    Customer.hasOne(Customers.CustomerResetPasswordToken, { as: 'customerResetPasswordToken', foreignKey: 'customerId', scope: { used: false } })
    Customer.hasMany(Customers.CustomerBot, { as: 'customerBots', foreignKey: 'customerId' })
    Customer.belongsToMany(Customers.Bot, { as: 'bots', through: Customers.CustomerBot, foreignKey: 'customerId' })
  }

  return Customer
}
