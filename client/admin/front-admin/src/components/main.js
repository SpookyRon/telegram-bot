class Main extends HTMLElement {

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
        *{
          box-sizing: border-box;
        }       
        
        main {
          display: grid;
          grid-template-columns: 1fr 2fr;
          padding: 20px;
          gap: 5rem;
          background-color: hsl(210, 30%, 16%); 

        }

        slot {
          background-color: hsl(210, 15%, 18%);
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
        }

        ::slotted(*) {
          color: hsl(210, 10%, 90%); /* Texto claro */
          margin-bottom: 1rem;
        }
        
      </style>
        
      <main>
        <slot></slot>
      </main>

    `
      
  }
}

customElements.define('main-component', Main);