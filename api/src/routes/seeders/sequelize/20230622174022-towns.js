'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('towns', [
      { id: 1, name: 'Palma de Mallorca', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Alcúdia', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Andratx', createdAt: new Date(), updatedAt: new Date() },
      { id: 4, name: 'Artà', createdAt: new Date(), updatedAt: new Date() },
      { id: 5, name: 'Binissalem', createdAt: new Date(), updatedAt: new Date() },
      { id: 6, name: 'Calvià', createdAt: new Date(), updatedAt: new Date() },
      { id: 7, name: 'Campos', createdAt: new Date(), updatedAt: new Date() },
      { id: 8, name: 'Capdepera', createdAt: new Date(), updatedAt: new Date() },
      { id: 9, name: 'Felanitx', createdAt: new Date(), updatedAt: new Date() },
      { id: 10, name: 'Inca', createdAt: new Date(), updatedAt: new Date() },
      { id: 11, name: 'Llucmajor', createdAt: new Date(), updatedAt: new Date() },
      { id: 12, name: 'Manacor', createdAt: new Date(), updatedAt: new Date() },
      { id: 13, name: 'Marratxí', createdAt: new Date(), updatedAt: new Date() },
      { id: 14, name: 'Pollença', createdAt: new Date(), updatedAt: new Date() },
      { id: 15, name: 'Sa Pobla', createdAt: new Date(), updatedAt: new Date() },
      { id: 16, name: 'Santanyí', createdAt: new Date(), updatedAt: new Date() },
      { id: 17, name: 'Santa Margalida', createdAt: new Date(), updatedAt: new Date() },
      { id: 18, name: 'Santa Maria del Camí', createdAt: new Date(), updatedAt: new Date() },
      { id: 19, name: 'Sant Llorenç des Cardassar', createdAt: new Date(), updatedAt: new Date() },
      { id: 20, name: 'Sineu', createdAt: new Date(), updatedAt: new Date() },
      { id: 21, name: 'Sóller', createdAt: new Date(), updatedAt: new Date() },
      { id: 22, name: 'Valldemossa', createdAt: new Date(), updatedAt: new Date() }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('towns', null, {})
  }
}
