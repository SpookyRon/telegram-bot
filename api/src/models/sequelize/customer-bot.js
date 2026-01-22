module.exports = function (sequelize, DataTypes) {
  const CustomerBot = sequelize.define('CustomerBot',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false
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
      tableName: 'customer_bots',
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
        },
        {
          name: 'customer_bots_customerId',
          using: 'BTREE',
          fields: [
            { name: 'customerId' }
          ]
        },
        {
          name: 'customer_bots_botId',
          using: 'BTREE',
          fields: [
            { name: 'botId' }
          ]
        }
      ]
    }
  )

  CustomerBot.associate = function (CustomerBots) {
    CustomerBot.belongsTo(CustomerBots.Customer, { as: 'customer', foreignKey: 'customerId' })
    CustomerBot.belongsTo(CustomerBots.Bot, { as: 'bot', foreignKey: 'botId' })
    CustomerBot.hasMany(CustomerBots.CustomerBotChat, { as: 'customerBotChats', foreignKey: 'customerBotId' })
  }

  return CustomerBot
}
