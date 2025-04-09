class Header extends HTMLElement {

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    this.data = []
  }

  async connectedCallback() {
    await this.render()
  }

  render() {
    this.shadow.innerHTML =
      /*html*/`
      <style>       
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          background: hsl(240, 40%, 20%);
          color: hsl(0, 0%, 100%);
        }
      </style>

      <header>
        <slot></slot>
      </header>

          `
      
  }
}

customElements.define('header-component', Header);