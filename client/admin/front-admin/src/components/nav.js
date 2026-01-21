class Nav extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.loadData()
    this.render()
  }

  loadData () {
    this.data = [
      {
        subcategories: [
          { categories: 'Inicio', link: '#dashboard' },
          { categories: 'Usuarios', link: '#users' },
          { categories: 'Estadísticas', link: '#analytics' },
          { categories: 'Configuración', link: '#settings' },
          { categories: 'Salir', link: '#logout' }
        ]
      }
    ]
  }

  render () {
    const links = this.data[0].subcategories.map((item) => {
      const isActive = item.link === '#users' ? 'active' : ''
      return `
        <li class="${isActive}">
          <a href="${item.link}">
            <span>${item.categories}</span>
          </a>
        </li>
      `
    }).join('')

    this.shadow.innerHTML = /* html */`
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        :host{
          max-width: 20%;
          width: 20%;
        }
        
        .nav {
          width: 80%;
          padding: 2rem 1rem;
          height: 100vh;
          background-color: #392d3aff;
        }

        .header {
          padding: 2px 10px 2px 1px;
          background-color: white;
          color: black;
          border: 3px solid #dee2e6;
          border-radius: 5px;
          height: min-content;
          display: flex;
          align-items: center;
          justify-self: center;
        }
        .avatar img {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: 50%;
          margin: 0.5rem;
          border: 2px solid #c8cbcf;
        }
        .name-user {
          font-size: 25px;
          font-family: "Noto Sans", sans-serif;
        }
        .nav-links {
          justify-self: center;
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          font-family: "Noto Sans", sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .nav-links ul {
          list-style: none;
        }
        .nav-links li a {
          display: flex;
          gap: 1rem;
          align-items: center;
          padding: 1rem;
          color: white;
          text-decoration: none;
        }
        .active {
          background-color: #323a46ff;
          color: white;
          border-radius: 1rem;
        }

        
      </style>
      <section class="nav">
        <div class="header">
          <div class="avatar">
            <img src="https://avatars.githubusercontent.com/u/12345678?v=4" alt="Avatar">
          </div>
          <div class="name-user">
            <span>Mark Sánchez García</span>
          </div>
        </div>
        <div class="nav-links">
          <ul>${links}</ul>
        </div>
      </section>
    `
  }
}

customElements.define('nav-component', Nav)
