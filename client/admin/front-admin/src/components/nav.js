class Nav extends HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadowRoot.innerHTML =
      /* html */`
      <style>
        .controller {
          border: none;
          background: hsl(210, 22%, 18%); 
          cursor: pointer;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 10px;

        }

        .controller svg {
          width: 30px;
          height: 30px;
        }

        .controller rect {
          rx: 4;
        }
        
        .controller rect:nth-child(1) {
          fill: hsl(210, 20%, 26%);
        }

        .controller rect:nth-child(2) {
          fill: hsl(210, 15%, 24%);
        }

        .controller rect:nth-child(3) {
          fill: hsl(210, 20%, 26%);
        }

        .controller rect:nth-child(4) {
          fill: hsl(210, 20%, 26%);
        }

        
      </style>
      <div class="header-menu">
      <button class="controller">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <rect width="13" height="13" x="1" y="1" fill="#4d4e53" rx="4"></rect>
          <rect width="13" height="13" x="18" y="1" fill="#d9d9da" rx="4"></rect>
          <rect width="13" height="13" x="1" y="18" fill="#4d4e53" rx="4"></rect>
          <rect width="13" height="13" x="18" y="18" fill="#4d4e53" rx="4"></rect>
        </svg>
      </button>
      </div>
    `
  }
}

customElements.define('nav-component', Nav)
