import { store } from '../../redux/store.js'
import { showFormElement } from '../../redux/crud-slice.js'

class FaqTable extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/faqs'
    this.filterQuery = null
    this.unsubscribe = null
  }

  async connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.filterQuery.query &&
          currentState.crud.filterQuery.endPoint === this.endpoint) {
        this.filterQuery = currentState.crud.filterQuery.query
        const endpoint = `${this.endpoint}?${currentState.crud.filterQuery.query}`
        this.loadData(endpoint).then(() => this.render())
      }

      if (!currentState.crud.filterQuery.query &&
          currentState.crud.tableEndpoint === this.endpoint) {
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
    } catch (error) {
      console.error('Error loading FAQs:', error)
      this.data = []
    }
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        .table { background: hsl(210,22%,18%); color: white; padding: 1rem; border-radius: 8px; }
        .faq-row { background: hsl(210,20%,26%); margin-bottom: .5rem; padding: .5rem; border-radius: 5px; }
        .faq-row h4 { margin: 0; font-size: 1.2rem; }
        .faq-row p { margin: .5rem 0 0; font-size: .9rem; }
        .actions { display:flex; gap:.5rem; justify-content:flex-end; }
        .actions button { padding: .3rem .5rem; cursor:pointer; border:none; border-radius:5px; }
        .edit { background:hsl(270,40%,55%); color:white; }
        .delete { background:hsl(0,80%,60%); color:white; }
      </style>
      <section class="table">
        ${(this.data.rows && this.data.rows.length > 0)
          ? this.data.rows.map(faq => `
            <div class="faq-row">
              <h4>${faq.title}</h4>
              <p>${faq.content}</p>
              <div class="actions">
                <button class="edit" data-id="${faq.id}">Editar</button>
                <button class="delete" data-id="${faq.id}">Borrar</button>
              </div>
            </div>
          `).join('')
          : '<p>No hay FAQs</p>'}
      </section>
    `

    this.attachEvents()
  }

  attachEvents () {
    this.shadow.querySelectorAll('.edit').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id
        try {
          const response = await fetch(`${this.endpoint}/${id}`)
          const data = await response.json()
          store.dispatch(showFormElement({ endPoint: this.endpoint, data }))
        } catch (err) {
          console.error('Error al cargar FAQ', err)
        }
      })
    })

    this.shadow.querySelectorAll('.delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id
        document.dispatchEvent(new CustomEvent('showDeleteModal', {
          detail: { endpoint: this.endpoint, elementId: id }
        }))
      })
    })
  }
}

customElements.define('faqs-table-component', FaqTable)
