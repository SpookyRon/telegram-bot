import isEqual from 'lodash-es/isEqual'
import { store } from '../../redux/store.js'
import { refreshTable } from '../../redux/crud-slice.js'

class CustomerForm extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/customers'
    this.unsubscribe = null
    this.formElementData = null
  }

  connectedCallback () {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.formElement.data && currentState.crud.formElement.endPoint === this.endpoint && !isEqual(this.formElementData, currentState.crud.formElement.data)) {
        this.formElementData = currentState.crud.formElement.data
        this.showElement(this.formElementData)
      };

      if (!currentState.crud.formElement.data && currentState.crud.formElement.endPoint === this.endpoint) {
        this.resetForm()
      }
    })

    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
      <style> 

        *{
          box-sizing: border-box;
        }    

        h1, li, input, button, label {
          font-family: "Lexend", sans-serif;
          font-optical-sizing: auto;
        }      

        .form {
          display: flex;
          flex-direction: column;
          align-items: top;
          border: 1px solid #ddd;
          padding: 10px;
          gap: 20px;
          width: 100%;
          background-color: hsl(210, 30%, 15%);
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

        }

        .header-form-menu{
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .validation-errors{
          display: none;
        }

        .validation-errors.active {
          background-color: #e74c3c;
          display: block;
          margin: 1rem 0;
          padding: 1rem;
          position: relative;
        }

        .validation-errors ul{
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .close-validation-errors {
          position: absolute;
          right: 1rem;
          top: 1rem;
          cursor: pointer;
        }

        .close-validation-errors svg {
          width: 2rem;
          height: 2rem;
          fill: hsl(0, 0%, 87%);
        }

        .tabs{
          display: flex;
          gap: 0.5rem;
        }

        .tab button {
          display: flex;
          width:100%;
          background-color: hsl(0, 0%, 87%);
          padding: 10px;
          border-radius: 5px;
          color: hsl(270, 40%, 55%);
          font-size: 1rem;
          border: none;
          cursor: pointer;
        }

        .tab.active button, .tab:hover button {
          background-color: hsl(270, 40%, 55%);
          color: hsl(0, 0%, 87%);
        }

        .buttons button {
          width: 40px;
          height: 40px;
          justify-content: center;
          align-items: center;
          padding: 8px;
          border: none;
          border-radius: 5px;
          background: hsl(0, 0%, 87%);
          color: hsl(0, 0%, 100%); 
          cursor: pointer;
        }

        .buttons button:hover {
          background-color: hsl(270, 40%, 45%);
          border-radius: 5px;
        }

        .tab-content{
          display: none;
        }

        .tab-content.active {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
        }

        form input{
          width: 100%;
          border-radius: 7px;
          padding: 8px;
          border: 1px solid hsl(210, 30%, 30%);
          background-color: hsl(210, 20%, 20%);
          color: hsl(0, 0%, 90%);
        }

        form .error {
          border-color: #e74c3c;
        }

        form label {
          color: hsl(0, 0%, 85%);
        }

        form input:focus {
          outline: 2px solid hsl(270, 40%, 55%); 
        }

        .form-element {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
      </style>
      
      <section class="form">
        <div class="header-form-menu">
          <div class="tabs">
            <div class="tab active" data-tab="general">
              <button type="button">General</button>
            </div>
            <div class="tab" data-tab="images">
              <button type="button">Imágenes</button>
            </div>
          </div>
          <div class="buttons">
            <button type="button" class="cleanButton">
              <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>video-input-scart</title><path d="M20.6 2.2L17.3 2.4L13.8 4.4L13.3 3.5L2 10V17H3V19C3 20.1 3.9 21 5 21H15C16.1 21 17 20.1 17 19V17H18V10H17L16.8 9.6L20.3 7.6L22.1 4.8L20.6 2.2M15 17V19H5V17H15Z" /></svg>
            </button>
            <button type="submit" class="saveButton">
              <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>content-save-all</title><path d="M17,7V3H7V7H17M14,17A3,3 0 0,0 17,14A3,3 0 0,0 14,11A3,3 0 0,0 11,14A3,3 0 0,0 14,17M19,1L23,5V17A2,2 0 0,1 21,19H7C5.89,19 5,18.1 5,17V3A2,2 0 0,1 7,1H19M1,7H3V21H17V23H3A2,2 0 0,1 1,21V7Z" /></svg>
            </button>
          </div>
        </div>
        <div class="form-body">
          <div class="validation-errors">
            <div class="close-validation-errors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close-circle-outline</title><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" /></svg>
            </div>
            <ul></ul>
          </div>
          <form>
            <input type="hidden" name="id" />
            <div class="tab-content active" data-tab="general">
              <div class="form-element">
                <label for="name">Nombre:</label>
                <input type="text" id="name" name="name" placeholder="Escribe tu nombre">
              </div>
              <div class="form-element">
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" placeholder="Escribe tu email">
              </div>
              <div class="form-element">
                <label for="phone">Teléfono:</label>
                <input type="phone" id="phone" name="phone" placeholder="Escribe tu teléfono">
              </div>
            </div>
            <div class="tab-content" data-tab="images">
              <div class="form-element">
                <label for="name">Imagen:</label>
                <input type="text" id="name" name="name" placeholder="Escribe tu nombre">
              </div>
            </div>
          </form>
        </div>        
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

      if (event.target.closest('.close-validation-errors')) {
        this.closeValidationErrors()
      }

      if (event.target.closest('.tab')) {
        this.shadow.querySelector('.tab.active').classList.remove('active')
        event.target.closest('.tab').classList.add('active')

        this.shadow.querySelector('.tab-content.active').classList.remove('active')
        this.shadow.querySelector(`.tab-content[data-tab='${event.target.closest('.tab').dataset.tab}']`).classList.remove('active')
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
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formDataJson)
          })

          if (!response.ok) {
            throw response
          }

          store.dispatch(refreshTable(this.endpoint))
          this.resetForm()

          document.dispatchEvent(new CustomEvent('notice', {
            detail: {
              message: 'Datos guardados correctamente',
              type: 'success'
            }
          }))
        } catch (error) {
          if (error.status === 422) {
            const data = await error.json()
            this.showValidationErrors(data.message)
          } else {
            document.dispatchEvent(new CustomEvent('notice', {
              detail: {
                message: 'No se han podido guardar los datos',
                type: 'error'
              }
            }))
          }
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

  showValidationErrors (errors) {
    this.shadow.querySelector('.validation-errors').classList.add('active')
    const errorList = this.shadow.querySelector('.validation-errors ul')

    errorList.innerHTML = ''
    this.shadow.querySelectorAll('.form-elemenT .error').forEach(error => error.classList.remove('error'))

    errors.forEach(error => {
      console.log(error)
      const li = document.createElement('li')
      li.textContent = error.message
      errorList.appendChild(li)

      this.shadow.querySelector(`[name="${error.path}"]`).classList.add('error')
    })
  }

  closeValidationErrors () {
    this.shadow.querySelector('.validation-errors').classList.remove('active')
    this.shadow.querySelector('.validation-errors ul').innerHTML = ''
  }

  resetForm () {
    this.shadow.querySelector('form').reset()
    this.shadow.querySelector('.validation-errors').classList.remove('active')
    this.shadow.querySelector('.validation-errors ul').innerHTML = ''
    this.shadow.querySelectorAll('.form-element input').forEach(input => input.classList.remove('error'))
  }
}

customElements.define('customers-form-component', CustomerForm)
