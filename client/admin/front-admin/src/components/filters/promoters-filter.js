import { store } from '../../redux/store.js'
import { setFilterQuery } from '../../redux/crud-slice.js'

class PromoterFilterModal extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/promoters'
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
        .overlay { /* igual que en users-filter */ }
      </style>
      <div class="overlay">
        <section class="validate">
          <h3>Filtrar Promotores</h3>
          <form>
            <div class="form-element">
              <label for="name">Nombre:</label>
              <input type="text" id="name" name="name" placeholder="Nombre">
            </div>
            <div class="form-element">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" placeholder="Email">
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

customElements.define('promoters-filter-modal-component', PromoterFilterModal)
