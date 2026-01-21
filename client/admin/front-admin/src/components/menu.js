class Menu extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    await this.loadData()
    await this.render()
  }

  loadData () {
    this.data = {
      title: 'Panel de Administración',
      menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>`
    }
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .menu {
          display: flex;
          justify-content: space-between;
          background-color: hsl(0, 0%, 14%);
          height: 4.5rem;
        }
        .menuTitle {
          align-content: center;
          color: hsl(0, 0%, 100%);
          font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
          text-transform: uppercase;
          padding: 1rem;
        }
        .menu-btn {
          background: none;
          border: none;
          padding: 1.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
        }
        .menu-btn svg {
          width: 30px;
          height: 30px;
          color: hsl(0, 0%, 100%);
        }
      </style>
      <section class="menu">
        <div class="menuTitle">
        <h1>${this.data.title}</h1>
        </div>
        <div class="menu-btn">${this.data.menu}</div>
      </section>
      
    `
  }
}

customElements.define('menu-component', Menu)
