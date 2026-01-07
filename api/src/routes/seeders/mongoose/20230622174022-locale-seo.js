const data = [
  {
    environment: 'admin',
    entity: 'dashboard',
    filename: 'dashboard.html',
    languageAlias: 'es',
    url: '/admin',
    title: 'Panel de Administración',
    description: 'Página principal del administrador',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'menus',
    filename: 'menus.html',
    languageAlias: 'es',
    url: '/admin/menus',
    title: 'Menús',
    description: 'Administración de menús del sitio',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'users',
    filename: 'users.html',
    languageAlias: 'es',
    url: '/admin/usuarios',
    title: 'Usuarios',
    description: 'Gestión de usuarios del sistema',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'promoters',
    filename: 'promoters.html',
    languageAlias: 'es',
    url: '/admin/promotoras',
    title: 'Promotoras',
    description: 'Administración de empresas promotoras',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'customers',
    filename: 'customers.html',
    languageAlias: 'es',
    url: '/admin/clientes',
    title: 'Clientes',
    description: 'Administración de clientes del sistema',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'spots',
    filename: 'spots.html',
    languageAlias: 'es',
    url: '/admin/espacios-para-eventos',
    title: 'Espacios para Eventos',
    description: 'Administración de espacios para eventos',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'users-credentials',
    filename: 'users-credentials.html',
    languageAlias: 'es',
    url: '/admin/credenciales-de-usuarios',
    title: 'Credenciales de Usuarios',
    description: 'Gestión de credenciales para usuarios',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'promoters-credentials',
    filename: 'promoters-credentials.html',
    languageAlias: 'es',
    url: '/admin/credenciales-de-promotoras',
    title: 'Credenciales de Promotoras',
    description: 'Gestión de credenciales para promotoras',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'event-categories',
    filename: 'event-categories.html',
    languageAlias: 'es',
    url: '/admin/categorias-de-eventos',
    title: 'Categorías de Eventos',
    description: 'Gestión de categorías de eventos',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'events',
    filename: 'events.html',
    languageAlias: 'es',
    url: '/admin/eventos',
    title: 'Eventos',
    description: 'Administración de eventos',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'bots',
    filename: 'bots.html',
    languageAlias: 'es',
    url: '/admin/bots',
    title: 'Bots',
    description: 'Administración de bots',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'faqs',
    filename: 'faqs.html',
    languageAlias: 'es',
    url: '/admin/faqs',
    title: 'FAQs',
    description: 'Administración de FAQs',
    sitemap: false
  },
  {
    environment: 'admin',
    entity: 'languages',
    filename: 'languages.html',
    languageAlias: 'es',
    url: '/admin/idiomas',
    title: 'Idiomas',
    description: 'Administración de idiomas',
    sitemap: false
  },
  {
    environment: 'customer',
    entity: 'home',
    filename: 'home.html',
    languageAlias: 'es',
    url: '/',
    title: 'Pedidos',
    description: 'Pedidos',
    sitemap: false
  },
  {
    environment: 'auth',
    entity: 'activation',
    filename: 'activate.html',
    languageAlias: 'es',
    url: '/cuenta/activacion',
    title: 'Activar cuenta',
    description: 'Activar cuenta',
    sitemap: false
  },
  {
    environment: 'auth',
    entity: 'activation',
    filename: 'activate.html',
    languageAlias: 'en',
    url: '/account/activation',
    title: 'Activate account',
    description: 'Activate account',
    sitemap: false
  },
  {
    environment: 'auth',
    entity: 'reset',
    filename: 'reset.html',
    languageAlias: 'es',
    url: '/cuenta/reset',
    title: 'Reinicio de contraseña',
    description: 'Reinicio de contraseña',
    sitemap: false
  },
  {
    environment: 'auth',
    entity: 'reset',
    filename: 'reset.html',
    languageAlias: 'en',
    url: '/account/reset',
    title: 'Reset password',
    description: 'Reset password',
    sitemap: false
  }
]

module.exports = async function (mongoose) {
  async function insertSeeder () {
    const Model = require('../../models/mongoose/locale-seo.js')(mongoose)
    await Model.insertMany(data)
  }

  insertSeeder()
}
