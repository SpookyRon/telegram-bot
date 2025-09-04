import { store } from '../../redux/store.js'
import { showFormElement } from '../../redux/crud-slice.js'

class BotTable extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/bots'
    this.filterQuery = null
    this.unsubscribe = null
  }

  async connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()
      if (currentState.crud.filterQuery.query && currentState.crud.filterQuery.endPoint === this.endpoint) {
        this.filterQuery = currentState.crud.filterQuery.query
        const endpoint = `${this.endpoint}?${this.filterQuery}`
        this.loadData(endpoint).then(() => this.render())
      }
      if (!currentState.crud.filterQuery.query && currentState.crud.tableEndpoint === this.endpoint) {
        this.loadData().then(() => this.render())
      }
    })
    await this.loadData()
    this.render()
  }

  disconnectedCallback () {
    if (this.unsubscribe) this.unsubscribe()
  }

  async loadData (endpoint = this.endpoint) {
    try {
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error(`Error fetching data: ${response.statusText}`)
      this.data = await response.json()
    } catch (err) {
      console.error('Error loading data:', err)
      this.data = { rows: [], meta: { total: 0, size: 0, currentPage: 1, pages: 1 } }
    }
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        .table { background:#222; padding:1rem; border-radius:10px; color:#eee; }
        li { list-style:none; }
      </style>
      <section class="table">
        <div class="table-body"></div>
      </section>
    `
    const tableBody = this.shadow.querySelector('.table-body')
    tableBody.innerHTML = ''
    if (this.data.rows.length === 0) {
      tableBody.textContent = 'No hay bots'
    } else {
      this.data.rows.forEach(bot => {
        const div = document.createElement('div')
        const ul = document.createElement('ul')
        ul.innerHTML = `
          <li>ID: ${bot.id}</li>
          <li>Plataforma: ${bot.platform}</li>
          <li>Nombre: ${bot.name}</li>
          <li>Descripción: ${bot.description}</li>
        `
        div.appendChild(ul)
        tableBody.appendChild(div)
      })
    }
  }
}

customElements.define('bots-table-component', BotTable)
