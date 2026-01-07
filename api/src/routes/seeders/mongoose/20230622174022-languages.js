const data = [
  {
    name: 'Español',
    alias: 'es',
    selected: true,
    default: true
  },
  {
    name: 'Catalán',
    alias: 'ca',
    selected: false,
    default: false
  },
  {
    name: 'Inglés',
    alias: 'en',
    selected: true,
    default: false
  },
  {
    name: 'Francés',
    alias: 'fr',
    selected: false,
    default: false
  },
  {
    name: 'Italiano',
    alias: 'it',
    selected: false,
    default: false
  },
  {
    name: 'Alemán',
    alias: 'de',
    selected: false,
    default: false
  },
  {
    name: 'Portugués',
    alias: 'pt',
    selected: false,
    default: false
  }
]

module.exports = async function (mongoose) {
  async function insertSeeder () {
    const Model = require('../../models/mongoose/language.js')(mongoose)
    await Model.insertMany(data)
  }

  insertSeeder()
}
