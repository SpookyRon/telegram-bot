class SubscriptionForm extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/customer/customers'
    this.eventsBound = false
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          font-family: "Nunito Sans", sans-serif;
        }

        .subscription-form {
          min-height: 100vh;
          padding: 3rem 1rem;
          background-color: hsl(198, 100%, 85%);
          display: grid;
          place-items: center;
        }

        .form-container {
          background: #fff;
          border-radius: 1.5rem;
          padding: 2rem;
          width: 100%;
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        h4 {
          font-size: 1.8rem;
          font-weight: 800;
        }

        span {
          color: hsl(0, 0%, 50%);
          font-weight: 600;
          margin-bottom: 1rem;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        input {
          padding: 1rem;
          font-size: 1rem;
          border-radius: 1rem;
          border: 2px solid #ccc;
        }

        input:focus {
          border-color: hsl(200, 77%, 52%);
          outline: none;
        }

        button {
          background-color: hsl(200, 77%, 52%);
          color: #fff;
          padding: 1rem;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 1rem;
          border: none;
          cursor: pointer;
        }

        button[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message {
          display: none;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-weight: 600;
        }

        .message.success {
          display: block;
          background: #dcfce7;
          color: #166534;
        }

        .message.error {
          display: block;
          background: #fee2e2;
          color: #991b1b;
        }
      </style>

      <section class="subscription-form">
        <div class="form-container">
          <h4>Empieza ahora</h4>
          <span>Te enviaremos un correo con los pasos para comenzar.</span>

          <form>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Dirección de correo"
              required
            />

            <button type="submit">Suscribirme</button>
          </form>

          <div class="message"></div>
        </div>
      </section>
    `

    this.bindEvents()
  }

  bindEvents () {
    const form = this.shadow.querySelector('form')
    const message = this.shadow.querySelector('.message')
    const button = form.querySelector('button')

    form.addEventListener('submit', async e => {
      e.preventDefault()

      if (button.disabled) return

      message.className = 'message'

      const name = form.name.value.trim()
      const email = form.email.value.trim()

      if (!name || !email || !email.includes('@')) {
        message.textContent = 'Introduce un nombre y un correo válidos'
        message.classList.add('error')
        return
      }

      button.disabled = true
      button.textContent = 'Enviando...'

      try {
        const res = await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email })
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data?.error || 'Error en el servidor')
        }

        message.textContent = 'Suscripción enviada correctamente'
        message.classList.add('success')
        form.reset()
      } catch (err) {
        message.textContent = err.message || 'No se pudo enviar la suscripción'
        message.classList.add('error')
      } finally {
        button.disabled = false
        button.textContent = 'Suscribirme'
      }
    })
  }
}

customElements.define('subscription-form-component', SubscriptionForm)
