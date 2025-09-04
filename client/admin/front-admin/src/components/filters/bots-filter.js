import { store } from '../../redux/store.js'
import { setFilterQuery } from '../../redux/crud-slice.js'

class BotFilterModal extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/bots'
    this.tableEndpoint = ''
    document.addEventListener('showFilterModal', this.showFilterModal.bind(this))
  }

  connectedCallback () {
    this.render()
  }

  showFilterModal (event) {
    if (event.detail.endpoint === this.endpoint) {
      this.shadow.querySelector('.overlay').classList.add('active')
    }
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
    <style>
      *{
        box-sizing: border-box;
        font-family: "Lexend", sans-serif;
      }

      .overlay{
        align-items: center;
        background-color: hsl(0, 0%, 0%, 0.7);
        display: flex;
        height: 100vh;
        justify-content: center;
        left: 0;
        position: fixed;
        top: 0;
        width: 100%;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s, visibility 0.3s;
      }

      .overlay.active{
        opacity: 1;
        visibility: visible;
      }

      .validate {
        background-color: hsl(210, 20%, 26%);
        border-radius: 5px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        text-align: center;
        gap: 2rem;
        border: 2px solid;
        border-color: hsl(0, 0%, 0%);
        width: 25%;
      }

      .option-buttons{
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: hsl(210, 25%, 15%);
        gap: 5rem;
      }

      .button{
        align-items: center;
        background-color: hsl(0, 0%, 87%);
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        height: 3rem;
        width: 7rem;
      }
      .button.small {
        font-size: 0.8rem;
      }

      .button:hover {
        background-color: hsl(270, 40%, 45%);
        color: white;
      }

      form{
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

    <div class="overlay">
      <section class="validate">
        <div class="notice-info">
          <span>FILTRAR BOTS</span>
        </div>
        <form>
          <div class="form-element">
            <label for="platform">Plataforma:</label>
            <input type="text" id="platform" name="platform" placeholder="Ej: Telegram, Discord...">
          </div>
          <div class="form-element">
            <label for="name">Nombre:</label>
            <input type="text" id="name" name="name" placeholder="Nombre del bot">
          </div>
          <div class="form-element">
            <label for="description">Descripción:</label>
            <input type="text" id="description" name="description" placeholder="Descripción del bot">
          </div>
          <div class="form-element">
            <label for="token">Token:</label>
            <input type="text" id="token" name="token" placeholder="Token del bot">
          </div>
        </form>
        <div class="option-buttons">
          <div class="button apply-button small">
            <span>Aplicar filtro</span>
          </div>
          <div class="button reset-button small">
            <span>Resetear</span>
          </div> 
        </div> 
      </section>
    </div>
    `

    this.renderButtons()
  }

  renderButtons () {
    const applyButton = this.shadow.querySelector('.apply-button')
    const resetButton = this.shadow.querySelector('.reset-button')

    applyButton.addEventListener('click', async (e) => {
      e.preventDefault()
      const form = this.shadow.querySelector('form')
      const formData = new FormData(form)
      const formDataJson = {}

      for (const [key, value] of formData.entries()) {
        formDataJson[key] = value !== '' ? value : null
      }

      const query = Object.entries(formDataJson)
        .filter(([_, value]) => value !== null)
        .map(([key, value]) => `${key}=${value}`).join('&')

      const filterQuery = {
        endPoint: this.endpoint,
        query
      }

      store.dispatch(setFilterQuery(filterQuery))

      this.shadow.querySelector('.overlay').classList.remove('active')
    })

    resetButton.addEventListener('click', (e) => {
      e.preventDefault()

      const form = this.shadow.querySelector('form')
      form.reset()

      const filterQuery = {
        endPoint: this.endpoint,
        query: ''
      }

      store.dispatch(setFilterQuery(filterQuery))
    })
  }
}

customElements.define('bots-filter-modal-component', BotFilterModal)
