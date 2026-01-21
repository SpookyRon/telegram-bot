class Users extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    await this.render()
    await this.loadProfile()
  }

  async loadProfile () {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/customer/profile`)

    if (response.ok) {
      const data = await response.json()

      const nameSpan = this.shadow.querySelector('.nameUser span')
      const emailSpan = this.shadow.querySelector('.emailUser span')

      if (nameSpan) nameSpan.textContent = data.name
      if (emailSpan) emailSpan.textContent = data.email
    }
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      :host{
        display: block;
      }

      *{
        box-sizing: border-box;
      }

      button{
        background-color: transparent;
        border: none;
        cursor: pointer;
        outline: none;
        padding: 0;
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;
      }

      .userLoged {
        background-color: hsl(0, 0%, 100%);
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;

        position: fixed;
        bottom: 0;
        left: 0;

        margin: 20px;
        padding: 1rem 1rem;

        display: flex;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;

        border: 2px solid hsl(200, 77%, 52%);
        border-radius: 12px;

        max-width: 420px;
        min-width: 300px;
        width: auto;

        box-shadow: 0 12px 26px hsla(200, 87%, 15%, 0.14);
      }

      .user {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        min-width: 0;
      }

      .nameUser {
        font-weight: 800;
        color: hsl(200, 87%, 15%);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 280px;
      }

      .emailUser {
        font-size: 0.85rem;
        font-weight: 600;
        color: hsl(0, 0%, 50%);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 280px;
      }

      .logout button {
        width: 44px;
        height: 44px;

        display: flex;
        align-items: center;
        justify-content: center;

        background-color: hsl(200, 77%, 52%);
        color: hsl(0, 0%, 100%);

        border-radius: 999px;

        transition: transform 120ms ease, background-color 120ms ease;
      }

      .logout button:hover {
        background-color: hsl(200, 77%, 42%);
        transform: translateY(-1px);
      }

      .logout button:active {
        transform: translateY(0px);
      }

      /* Si quieres mantener el rojo al hover como antes, descomenta esto:
      .logout button:hover {
        background-color: hsl(0, 85%, 60%);
      }
      */

      .logout button svg {
        width: 24px;
        height: 24px;
      }
    </style>

    <section class="userLoged" aria-label="Usuario conectado">
      <div class="user">
        <div class="nameUser">
          <span></span>
        </div>
        <div class="emailUser">
          <span></span>
        </div>
      </div>

      <div class="logout">
        <button aria-label="Cerrar sesión" title="Cerrar sesión">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z" />
          </svg>
        </button>
      </div>
    </section>
    `

    this.shadow.querySelector('.logout button').addEventListener('click', async () => {
      const logout = await fetch('/api/auth/customer/logout', {
        method: 'DELETE'
      })
      window.location.href = '/login'
      console.log(logout)
    })
  }
}

customElements.define('users-component', Users)
