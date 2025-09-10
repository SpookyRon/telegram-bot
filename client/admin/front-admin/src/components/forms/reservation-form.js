import isEqual from 'lodash-es/isEqual'
import { store } from '../../redux/store.js'
import { refreshTable } from '../../redux/crud-slice.js'

class ReservationForm extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/reservations'
    this.unsubscribe = null
    this.formElementData = null
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.formElement.data &&
        currentState.crud.formElement.endPoint === this.endpoint &&
        !isEqual(this.formElementData, currentState.crud.formElement.data)) {
        this.formElementData = currentState.crud.formElement.data
        this.showElement(this.formElementData)
      }

      if (!currentState.crud.formElement.data &&
        currentState.crud.formElement.endPoint === this.endpoint) {
        this.resetForm()
      }
    })

    this.render()
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        * { box-sizing: border-box; }
        label, input, textarea { font-family: "Lexend", sans-serif; }
        .form { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; background: hsl(210,30%,15%); border-radius: 10px; }
        .form-element { display: flex; flex-direction: column; gap: .5rem; }
        input, textarea { padding: .5rem; border-radius: 7px; border: 1px solid hsl(210,30%,30%); background: hsl(210,20%,20%); color: white; }
        input:focus, textarea:focus { outline: 2px solid hsl(270,40%,55%); }
        .buttons { display: flex; justify-content: flex-end; gap: .5rem; }
        .buttons button { padding: .5rem 1rem; border: none; border-radius: 5px; cursor: pointer; }
        .saveButton { background: hsl(270,40%,55%); color: white; }
        .cleanButton { background: hsl(0,0%,87%); }
      </style>
      <section class="form">
        <form>
          <input type="hidden" name="id" />
          <div class="form-element">
            <label for="name">Título:</label>
            <input type="text" id="name" name="name" placeholder="Nombre">
          </div>
          <div class="form-element">
            <label for="title">Título:</label>
            <input type="text" id="title" name="title" placeholder="Pregunta">
          </div>
          <div class="form-element">
            <label for="buttonText">Texto del botón:</label>
            <input type="text" id="buttonText" name="buttonText" placeholder="Texto del botón">
          </div>
          <div class="form-element">
            <label for="buttonLink">"Enlace del botón:</label>
            <input type="text" id="buttonLink" name="buttonLink" placeholder="Enlace del botón">
          </div>
          <div class="form-element">
            <label for="content">Contenido:</label>
            <textarea id="content" name="description" rows="4" placeholder="Respuesta"></textarea>
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

      if (event.target.closest('.cleanButton')) {
        this.resetForm()
      }

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

          document.dispatchEvent(new CustomEvent('notice', {
            detail: { message: 'Reserva guardada correctamente', type: 'success' }
          }))
        } catch (error) {
          document.dispatchEvent(new CustomEvent('notice', {
            detail: { message: 'Error al guardar la reserva', type: 'error' }
          }))
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

customElements.define('reservation-form-component', ReservationForm)
