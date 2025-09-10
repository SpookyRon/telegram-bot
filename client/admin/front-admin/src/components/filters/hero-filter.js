import { store } from '../../redux/store.js'
import { setFilterQuery } from '../../redux/crud-slice.js'

class HeroFilterModal extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/heroes'
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
    this.shadow.innerHTML = /* html */`
      <style>
        * { box-sizing: border-box; font-family: "Lexend", sans-serif; }
        .overlay {
          align-items: center;
          background-color: hsl(0, 0%, 0%, 0.7);
          display: flex;
          height: 100vh;
          justify-content: center;
          left: 0; top: 0;
          position: fixed;
          width: 100%;
          opacity: 0; visibility: hidden;
          transition: opacity 0.3s, visibility 0.3s;
        }
        .overlay.active { opacity: 1; visibility: visible; }
        .validate {
          background: hsl(210, 20%, 26%);
          border-radius: 5px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 25%;
        }
        form { display: flex; flex-direction: column; gap: 10px; }
        label { color: hsl(0,0%,85%); }
        input {
          border-radius: 7px;
          padding: 8px;
          border: 1px solid hsl(210,30%,30%);
          background: hsl(210,20%,20%);
          color: hsl(0,0%,90%);
        }
        input:focus { outline: 2px solid hsl(270,40%,55%); }
        .option-buttons { display:flex; justify-content: space-around; gap: 1rem; }
        .button {
          background: hsl(0,0%,87%);
          padding: 0.5rem 1rem;
          border-radius: 5px;
          cursor: pointer;
        }
        .button:hover { background: hsl(270,40%,45%); color:white; }
      </style>

      <div class="overlay">
        <section class="validate">
          <div class="notice-info">
            <span>Filtrar FAQs</span>
          </div>
          <form>
            <div class="form-element">
              <label for="name">Nombre:</label>
              <input type="text" id="name" name="name" placeholder="Buscar por nombre">
            </div>
          </form>
          <div class="option-buttons">
            <div class="button apply-button">Aplicar</div>
            <div class="button reset-button">Resetear</div>
          </div>
        </section>
      </div>
    `
    this.renderButtons()
  }

  renderButtons () {
    const applyButton = this.shadow.querySelector('.apply-button')
    const resetButton = this.shadow.querySelector('.reset-button')

    applyButton.addEventListener('click', (e) => {
      e.preventDefault()
      const form = this.shadow.querySelector('form')
      const formData = new FormData(form)
      const query = Object.entries(Object.fromEntries(formData))
        .filter(([_, v]) => v !== '')
        .map(([k, v]) => `${k}=${v}`).join('&')

      store.dispatch(setFilterQuery({ endPoint: this.endpoint, query }))
      this.shadow.querySelector('.overlay').classList.remove('active')
    })

    resetButton.addEventListener('click', (e) => {
      e.preventDefault()
      const form = this.shadow.querySelector('form')
      form.reset()
      store.dispatch(setFilterQuery({ endPoint: this.endpoint, query: '' }))
    })
  }
}

customElements.define('hero-filter-modal-component', HeroFilterModal)
