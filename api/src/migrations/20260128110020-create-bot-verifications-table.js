'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bot_verifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      verificationCode: {
        type: Sequelize.STRING(6),
        allowNull: false
      },
      telegramUserId: {
        type: Sequelize.STRING(32),
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    })

    await queryInterface.addIndex('bot_verifications', ['email'], {
      name: 'bot_verifications_email'
    })

    await queryInterface.addIndex('bot_verifications', ['telegramUserId'], {
      name: 'bot_verifications_telegramUserId'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bot_verifications')
  }
}
