class Form extends HTMLElement {
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
    this.data = [

    ]
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
          padding: 20px;
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

        .form-menu button {
          display: flex;
          width:100%;
          background-color: hsl(270, 40%, 45%);
          padding: 10px;
          border-radius: 5px;
          color: hsl(0, 0%, 100%);
          font-size: 1rem;
          border: none;
          cursor: pointer;
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

        .user-form{
          display: flex;
          gap: 10px;
          width: 100%;
        }

        .user-form input{
          width: 100%;
          border-radius: 7px;
          padding: 8px;
          border: 1px solid hsl(210, 30%, 30%);
          background-color: hsl(210, 20%, 20%);
          color: hsl(0, 0%, 90%);
        }

        .user-form label {
          color: hsl(0, 0%, 85%);
        }

        .user-form input:focus {
          outline: 2px solid hsl(270, 40%, 55%); 
        }


      </style>

      <section class="form">
        <div class="header-form-menu">
          <div class="form-menu">
            <button>General</button>
          </div>
          <div class="buttons">
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>video-input-scart</title><path d="M20.6 2.2L17.3 2.4L13.8 4.4L13.3 3.5L2 10V17H3V19C3 20.1 3.9 21 5 21H15C16.1 21 17 20.1 17 19V17H18V10H17L16.8 9.6L20.3 7.6L22.1 4.8L20.6 2.2M15 17V19H5V17H15Z" /></svg>
            </button>
            <button>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>content-save-all</title><path d="M17,7V3H7V7H17M14,17A3,3 0 0,0 17,14A3,3 0 0,0 14,11A3,3 0 0,0 11,14A3,3 0 0,0 14,17M19,1L23,5V17A2,2 0 0,1 21,19H7C5.89,19 5,18.1 5,17V3A2,2 0 0,1 7,1H19M1,7H3V21H17V23H3A2,2 0 0,1 1,21V7Z" /></svg>
            </button>
          </div>
        </div>
        <form class="user-form">
          <label for="name">Nombre:</label>
          <input type="text" id="name" name="name" placeholder="Escribe tu nombre">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="Escribe tu email">
        </form>
      </section>

          `
  }
}

customElements.define('form-component', Form)
