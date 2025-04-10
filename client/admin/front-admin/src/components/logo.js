class Logo extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    this.data = []
  }

  async connectedCallback () {
    await this.loadData()
    await this.render()
  }

  loadData () {
    this.data = {
      title: 'Pedidos'
    }
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
      <style>
        h1, li, input, button, label {
          font-family: "Lexend", sans-serif;
          font-optical-sizing: auto;
        }

        .title {
          font-size: 1rem;
          font-weight: bold;
          color: hsl(240, 40%, 60%);
        }
      </style>

      <div class="title">
      <h1>${this.data.title}</h1>
      </div>
  `
  }
}

customElements.define('logo-component', Logo)
