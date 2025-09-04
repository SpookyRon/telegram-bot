import isEqual from 'lodash-es/isEqual'
import { store } from '../../redux/store.js'
import { refreshTable } from '../../redux/crud-slice.js'

class BotForm extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/bots'
    this.unsubscribe = null
    this.formElementData = null
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()
      if (currentState.crud.formElement.data && currentState.crud.formElement.endPoint === this.endpoint && !isEqual(this.formElementData, currentState.crud.formElement.data)) {
        this.formElementData = currentState.crud.formElement.data
        this.showElement(this.formElementData)
      }
      if (!currentState.crud.formElement.data && currentState.crud.formElement.endPoint === this.endpoint) {
        this.resetForm()
      }
    })
    this.render()
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        * { box-sizing: border-box; }
        label { color: #eee; }
        input, textarea { width:100%; padding:8px; border-radius:5px; }
        .form { display:flex; flex-direction:column; gap:1rem; background:#222; padding:1rem; border-radius:10px; }
        .buttons { display:flex; gap:10px; }
      </style>
      <section class="form">
        <form>
          <input type="hidden" name="id" />
          <div class="form-element">
            <label for="platform">Plataforma</label>
            <input type="text" id="platform" name="platform">
          </div>
          <div class="form-element">
            <label for="name">Nombre</label>
            <input type="text" id="name" name="name">
          </div>
          <div class="form-element">
            <label for="description">Descripción</label>
            <textarea id="description" name="description"></textarea>
          </div>
          <div class="form-element">
            <label for="token">Token</label>
            <input type="text" id="token" name="token">
          </div>
          <div class="buttons">
            <button type="button" class="cleanButton">Limpiar</button>
            <button type="submit" class="saveButton">Guardar</button>
          </div>
        </form>
      </section>
    `
    this.renderButtons()
  }

  renderButtons () {
    this.shadow.querySelector('.form').addEventListener('click', async event => {
      event.preventDefault()
      if (event.target.closest('.cleanButton')) this.resetForm()
      if (event.target.closest('.saveButton')) {
        const form = this.shadow.querySelector('form')
        const formData = new FormData(form)
        const formDataJson = {}
        for (const [key, value] of formData.entries()) {
          formDataJson[key] = value !== '' ? value : null
        }
        const id = this.shadow.querySelector('[name="id"]').value
        const endpoint = id ? `${this.endpoint}/${id}` : this.endpoint
        const method = id ? 'PUT' : 'POST'
        delete formDataJson.id
        try {
          const response = await fetch(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formDataJson)
          })
          if (!response.ok) throw response
          store.dispatch(refreshTable(this.endpoint))
          this.resetForm()
          document.dispatchEvent(new CustomEvent('notice', { detail: { message: 'Bot guardado', type: 'success' } }))
        } catch {
          document.dispatchEvent(new CustomEvent('notice', { detail: { message: 'Error guardando bot', type: 'error' } }))
        }
      }
    })
  }

  showElement (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (this.shadow.querySelector(`[name="${key}"]`)) {
        this.shadow.querySelector(`[name="${key}"]`).value = value
      }
    })
  }

  resetForm () {
    this.shadow.querySelector('form').reset()
  }
}

customElements.define('bots-form-component', BotForm)
