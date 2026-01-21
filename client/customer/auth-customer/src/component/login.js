class Login extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.basePath = this.getAttribute('base-path') || ''
  }

  connectedCallback () {
    this.render()
  }

  render () {
    this.shadow.innerHTML =
      /* html */`
        <style>

          :host{
            display: block;
            width: 300px;
            box-sizing: border-box;
            padding: 1.25rem;
            border-radius: 1rem;
            background: linear-gradient(145deg, hsl(226 55% 22%), hsl(226 55% 16%));
            border: 1px solid hsl(0 0% 100% / 0.10);
            box-shadow:
              0 12px 30px hsl(0 0% 0% / 0.35),
              inset 0 1px 0 hsl(0 0% 100% / 0.08);
          }

          .login-form{
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          h2{
            color: hsl(0, 0%, 100%);
            font-family: 'Lato' , sans-serif;
            font-size: 1.55rem;
            font-weight: 700;
            text-align: center;
            margin: 0 0 0.25rem 0;
            letter-spacing: 0.2px;
          }

          form{
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }

          .form-element{
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 100%;
          }

          .form-element-label label{
            color: hsl(0 0% 100% / 0.92);
            font-family: 'Lato' , sans-serif;
            font-weight: 600;
            font-size: 0.95rem;
            transition: color 0.25s ease, transform 0.25s ease;
          }

          .form-element-input{
            width: 100%;
          }

          .form-element-input input{
            background: hsl(226 45% 28% / 0.65);
            border: 1px solid hsl(0 0% 100% / 0.14);
            border-bottom: 1px solid hsl(0 0% 100% / 0.28);
            border-radius: 0.75rem;
            box-sizing: border-box;
            color: hsl(0, 0%, 100%);
            font-family: 'Roboto' , sans-serif;
            font-weight: 500;
            outline: none;
            padding: 0.75rem 0.85rem;
            width: 100%;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, transform 0.2s ease;
          }

          .form-element-input input::placeholder{
            color: hsl(0 0% 100% / 0.55);
          }

          .form-element-input input:hover{
            background: hsl(226 45% 30% / 0.8);
            border-color: hsl(0 0% 100% / 0.20);
          }

          .form-element-input input:focus{
            background: hsl(226 45% 32% / 0.9);
            border-color: hsl(272 70% 70% / 0.65);
            box-shadow:
              0 0 0 4px hsl(272 70% 60% / 0.22),
              0 10px 22px hsl(0 0% 0% / 0.22);
            transform: translateY(-1px);
          }

          .form-element:focus-within .form-element-label label{
            color: hsl(272 80% 86%);
            transform: translateY(-1px);
          }

          .form-submit{
            background: linear-gradient(135deg, hsl(272 55% 42%), hsl(226 70% 52%));
            border: 1px solid hsl(0 0% 100% / 0.14);
            border-radius: 0.85rem;
            color: hsl(0, 0%, 100%);
            cursor: pointer;
            font-family: 'Lato', sans-serif;
            font-size: 1rem;
            font-weight: 700;
            margin-top: 0.5rem;
            padding: 0.8rem 1rem;
            letter-spacing: 0.3px;
            transition: transform 0.15s ease, filter 0.15s ease, box-shadow 0.15s ease;
            box-shadow:
              0 10px 22px hsl(0 0% 0% / 0.25),
              inset 0 1px 0 hsl(0 0% 100% / 0.15);
          }

          .form-submit:hover{
            filter: brightness(1.08);
            transform: translateY(-1px);
          }

          .form-submit:active{
            transform: translateY(0px);
            filter: brightness(0.98);
          }

          .form-submit:focus-visible{
            outline: none;
            box-shadow:
              0 0 0 4px hsl(0 0% 100% / 0.18),
              0 10px 22px hsl(0 0% 0% / 0.25),
              inset 0 1px 0 hsl(0 0% 100% / 0.15);
          }

          .reset{
            display: flex;
            justify-content: center;
            width: 100%;
            margin-top: 0.25rem;
          }

          a{
            color: hsl(0 0% 100% / 0.9);
            font-family: 'Lato' , sans-serif;
            font-size: 1rem;
            font-weight: 600;
            text-decoration: none;
            padding: 0.35rem 0.5rem;
            border-radius: 0.5rem;
            transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
          }

          a:hover{
            color: hsl(0, 0%, 100%);
            background: hsl(0 0% 100% / 0.08);
            transform: translateY(-1px);
          }

          a:focus-visible{
            outline: none;
            box-shadow: 0 0 0 4px hsl(0 0% 100% / 0.18);
          }

        </style>

        <div class="login-form">
          <h2>${this.getAttribute('title')}</h2>

          <form class="form">
            <div class="form-element">
              <div class="form-element-label">
                <label for="email">Email</label>
              </div>
              <div class="form-element-input">
                <input type="email" name="email" id="email" required>
              </div>
            </div>
            <div class="form-element">
              <div class="form-element-label">
                <label for="password">Password</label>
              </div>
              <div class="form-element-input">
                <input type="password" name="password" id="password" required>
              </div>
            </div>
            <button type="submit" class="form-submit">Enviar</button>
          </form>

          <div class="reset">
            <a href="/admin/login/reset">Olvidé mi contraseña</a>
          </div>
        </div>
        `

    this.shadow.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault()
      this.submitForm(event)
    })
  }

  async submitForm (form) {
    const endpoint = import.meta.env.VITE_API_URL
    const formData = new FormData(form)
    const formDataJson = Object.fromEntries(formData.entries())

    try {
      const result = await fetch(`${endpoint}/api/auth/user/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataJson)
      })

      if (result.ok) {
        const data = await result.json()
        if (data.token) localStorage.setItem('customer_jwt', data.token)
          
        window.location.href = data.redirection
      } else {
        const error = await result.json()
        console.log(error.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
}

customElements.define('login-component', Login)
