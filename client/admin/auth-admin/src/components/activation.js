class Activation extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.data = {}
    this.state = {
      token: '',
      loading: false,
      success: false,
      error: ''
    }
  }

  async connectedCallback () {
    await this.loadData()
    this.state.token = this.getTokenFromUrl()
    await this.render()
    this.bindEvents()
  }

  get apiBase () {
    // Puedes pasar api-base="http://dev-youthing.com/api"
    // Si no, usa por defecto tu dominio
    return (this.getAttribute('api-base') || 'http://dev-youthing.com/auth/activation').replace(/\/+$/, '')
  }

  getTokenFromUrl () {
    const url = new URL(window.location.href)
    return url.searchParams.get('token') || ''
  }

  async loadData () {
    this.data = {
      title: 'Activa tu cuenta',
      info: 'Te queda un último paso: crea tu contraseña para finalizar la activación.',
      featured: 'activación segura con token',
      start: 'Crea tu contraseña',
      instructions: 'Usaremos el token del enlace para validar tu cuenta. Después podrás iniciar sesión.',
      textButton: 'Activar cuenta',
      loginText: 'Ir a iniciar sesión'
    }
  }

  setState (patch) {
    this.state = { ...this.state, ...patch }
    this.render()
    this.bindEvents()
  }

  bindEvents () {
    const form = this.shadow.querySelector('form')
    if (form && !form.__wired) {
      form.__wired = true
      form.addEventListener('submit', (e) => this.onSubmit(e))
    }

    const toggle = this.shadow.querySelector('#togglePass')
    if (toggle && !toggle.__wired) {
      toggle.__wired = true
      toggle.addEventListener('click', () => this.togglePassword())
    }
  }

  togglePassword () {
    const p1 = this.shadow.querySelector('#password')
    const p2 = this.shadow.querySelector('#password2')
    const isPassword = p1.type === 'password'
    const next = isPassword ? 'text' : 'password'
    p1.type = next
    p2.type = next
    const btn = this.shadow.querySelector('#togglePass')
    btn.textContent = isPassword ? 'Ocultar' : 'Mostrar'
  }

  validate (password, password2) {
    if (!this.state.token) return 'Falta el token en la URL (?token=...). Abre el enlace del email.'
    if (!password || !password2) return 'Rellena ambos campos de contraseña.'
    if (password !== password2) return 'Las contraseñas no coinciden.'
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
    return ''
  }

  async onSubmit (e) {
    e.preventDefault()

    const password = this.shadow.querySelector('#password').value
    const password2 = this.shadow.querySelector('#password2').value

    const err = this.validate(password, password2)
    if (err) {
      this.setState({ error: err, success: false })
      return
    }

    this.setState({ loading: true, error: '', success: false })

    try {
      // Endpoint sugerido por tu backend:
      // POST /cuenta/credenciales { token, password }
      const res = await fetch(`${this.apiBase}/cuenta/credenciales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.state.token, password })
      })

      if (!res.ok) {
        let msg = 'No se pudo activar la cuenta.'
        try {
          const data = await res.json()
          msg = data.error || data.message || msg
        } catch (_) {}
        throw new Error(msg)
      }

      this.setState({ loading: false, success: true, error: '' })
    } catch (error) {
      this.setState({ loading: false, success: false, error: error?.message || 'Error inesperado' })
    }
  }

  render () {
    const { token, loading, success, error } = this.state

    this.shadow.innerHTML =
    /* html */`
    <style>
      *{ box-sizing: border-box; }
      button{ background-color: transparent; border: none; cursor: pointer; outline: none; padding: 0; }
      h1, h2, h3, h4, h5, h6, p{ margin: 0; }
      h1, h2, h3, h4, h5, h6, p, a, span, li, label, input, button{
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;
      }
      img{ object-fit: cover; width: 100%; }

      .subscription-form{
        align-items: center;
        background-color: hsl(198, 100%, 85%);
        display: grid;
        gap: 2rem;
        grid-template-columns: 1fr;
        min-height: 100vh;
        padding: 3rem 1rem;
      }

      @media (min-width: 768px) {
        .subscription-form{ padding: 3rem 10%; }
      }

      @media (min-width: 1280px) {
        .subscription-form{
          grid-template-columns: 1fr 1fr;
          padding: 3rem 10%;
        }
      }

      .explanation {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      @media (min-width: 1280px) {
        .explanation { align-items: flex-start; }
      }

      .explanation-title h3 {
        font-size: 2rem;
        font-weight: 800;
        text-align: center;
      }

      @media (min-width: 768px) {
        .explanation-title h3 { font-size: 3rem; }
      }

      @media (min-width: 1280px) {
        .explanation-title h3 {
          font-size: 3rem;
          line-height: 3rem;
          text-align: left;
        }
      }

      .explanation-info p{
        color: hsl(0, 0%, 50%);
        font-size: 1.2rem;
        font-weight: 600;
        line-height: 2rem;
        text-align: center;
      }

      @media (min-width: 768px) {
        .explanation-info p{ font-size: 2rem; }
      }

      @media (min-width: 1280px) {
        .explanation-info p{ text-align: left; }
      }

      .explanation-featured{
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        padding: 1rem;
        width: max-content;
      }

      .explanation-featured span{
        color: hsl(0, 0%, 100%);
        font-size: 1.2rem;
        font-weight: 600;
      }

      @media (min-width: 768px) {
        .explanation-featured span{ font-size: 2rem; }
      }

      .form-container {
        background-color: white;
        border-radius: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 2rem;
        width: 100%;
      }

      .info-area { display: flex; justify-content: space-between; gap: 1rem; }
      .info-area-text { display: flex; flex-direction: column; gap: 0.5rem; }

      .info-area-title h4 {
        font-size: 1.8rem;
        font-weight: 800;
      }

      @media (min-width: 768px) {
        .info-area-title h4 { font-size: 2rem; }
      }

      .info-area-subtitle span {
        color: hsl(0, 0%, 50%);
        font-size: 1rem;
        font-weight: 600;
      }

      @media (min-width: 768px) {
        .info-area-subtitle span { font-size: 1.2rem; }
      }

      .info-area-icon svg {
        animation: top-bottom 2s infinite;
        width: 4.2rem;
        fill: hsl(0, 0%, 70%);
        text-align: center;
      }

      @keyframes top-bottom {
        0%, 100%, 20%, 50%, 80% { transform: translateY(0); }
        40% { transform: translateY(-8px); }
        60% { transform: translateY(-4px); }
      }

      .form form{ display: flex; flex-direction: column; gap: 1.2rem; }

      .form-element-input input {
        border: 2px solid rgb(192, 192, 192);
        border-radius: 1.5rem;
        font-size: 1rem;
        outline: none;
        padding: 1rem;
        width: 100%;
      }

      @media (min-width: 768px) {
        .form-element-input input { font-size: 1.2rem; }
      }

      .form-element-input input:hover { border-color: hsl(200, 77%, 52%); }

      .form-element-button button{
        background-color: hsl(200, 77%, 52%);
        border-radius: 1rem;
        color: hsl(0, 0%, 100%);
        font-size: 1.2rem;
        font-weight: 600;
        padding: 1rem;
        width: 100%;
      }

      @media (min-width: 768px) {
        .form-element-button button{ font-size: 1.4rem; }
      }

      .form-element-button button:hover{ background-color: hsl(200, 77%, 42%); }

      .row-actions{
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 1rem;
        align-items: center;
      }

      @media (max-width: 420px) {
        .row-actions{ grid-template-columns: 1fr; }
      }

      .toggle{
        border: 2px solid rgb(192, 192, 192);
        border-radius: 1rem;
        padding: 1rem;
        font-weight: 700;
        color: hsl(0, 0%, 35%);
      }

      .toggle:hover{ border-color: hsl(200, 77%, 52%); color: hsl(200, 77%, 42%); }

      .notice{
        border-radius: 1rem;
        padding: 1rem;
        font-weight: 700;
        font-size: 0.95rem;
      }

      .notice.error{ background: hsl(0 90% 92%); color: hsl(0 60% 35%); }
      .notice.success{ background: hsl(150 60% 90%); color: hsl(155 55% 25%); }
      .notice.info{ background: hsl(210 80% 93%); color: hsl(215 55% 25%); }

      .small{
        font-size: 0.9rem;
        color: hsl(0, 0%, 45%);
        font-weight: 700;
        word-break: break-all;
      }

      .disabled{
        opacity: 0.6;
        pointer-events: none;
      }

      .link{
        display: inline-block;
        margin-top: .3rem;
        color: hsl(200, 77%, 42%);
        font-weight: 800;
        text-decoration: none;
      }
      .link:hover{ text-decoration: underline; }
    </style>

    <section class="subscription-form">
      <div class="explanation">
        <div class="explanation-title">
          <h3>${this.escape(this.data.title)}</h3>
        </div>
        <div class="explanation-info">
          <p>${this.escape(this.data.info)}</p>
        </div>
        <div class="explanation-featured">
          <span>${this.escape(this.data.featured)}</span>
        </div>
      </div>

      <div class="form-container">
        <div class="info-area">
          <div class="info-area-text">
            <div class="info-area-title">
              <h4>${this.escape(this.data.start)}</h4>
            </div>
            <div class="info-area-subtitle">
              <span>${this.escape(this.data.instructions)}</span>
            </div>
          </div>

          <div class="info-area-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>hand-pointing-down</title><path d="M9.9,21V11L6.7,12.69L6.5,12.72C6.19,12.72 5.93,12.6 5.74,12.4L5,11.63L9.9,7.43C10.16,7.16 10.5,7 10.9,7H17.4C18.17,7 18.9,7.7 18.9,8.5V12.86C18.9,13.47 18.55,14 18.05,14.2L13.11,16.4L11.9,16.53V21A1,1 0 0,1 10.9,22A1,1 0 0,1 9.9,21M18.9,5H10.9V2H18.9V5Z" /></svg>
          </div>
        </div>

        ${
          !token
            ? `<div class="notice error">
                No hay token en la URL. Abre esta página desde el enlace del email (debe venir como <code>?token=...</code>).
               </div>`
            : ''
        }

        ${
          error
            ? `<div class="notice error">❌ ${this.escape(error)}</div>`
            : ''
        }

        ${
          success
            ? `<div class="notice success">
                ✅ Cuenta activada. Ya puedes iniciar sesión.
                <div><a class="link" href="/login">${this.escape(this.data.loginText)}</a></div>
               </div>`
            : ''
        }

        <div class="form ${loading ? 'disabled' : ''}">
          <form>
            <div class="form-element">
              <div class="form-element-input">
                <input class="small" type="text" value="${this.escape(token)}" readonly placeholder="Token">
              </div>
            </div>

            <div class="form-element">
              <div class="form-element-input">
                <input id="password" type="password" placeholder="Contraseña (mín. 8 caracteres)" autocomplete="new-password">
              </div>
            </div>

            <div class="form-element row-actions">
              <div class="form-element-input">
                <input id="password2" type="password" placeholder="Repite la contraseña" autocomplete="new-password">
              </div>
              <button id="togglePass" class="toggle" type="button">Mostrar</button>
            </div>

            <div class="form-element-button">
              <button type="submit">${loading ? 'Activando...' : this.escape(this.data.textButton)}</button>
            </div>

            <div class="notice info">
              Endpoint: <span class="small">${this.escape(this.apiBase)}/cuenta/credenciales</span>
            </div>
          </form>
        </div>
      </div>
    </section>
    `
  }

   this.shadow.querySelector('form').addEventListener('submit', async (event) => {
      event.preventDefault()
      const password = this.shadow.querySelector('input[name="password"]').value
      const repeatPassword = this.shadow.querySelector('input[name="repeat-password"]').value
      const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/

      if (password !== repeatPassword) {
        this.shadow.querySelector('.message span').textContent = 'Las contraseñas no coinciden'
        return
      }

      if (!password || !repeatPassword) {
        this.shadow.querySelector('.message span').textContent = 'Los campos no pueden estar vacios'
        return
      }

      if (!regex.test(password)) {
        this.shadow.querySelector('.message span').textContent = 'La contraseña no cumple con los requisitos mínimos'
        return
      }

      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get('token')

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, password })
      })

      if (response.ok) {
        this.shadow.querySelector('.message span').textContent = 'Cuenta activada correctamente'
        const form = this.shadow.querySelector('.form')
        form.reset()
      } else {
        const data = await response.json()
        this.shadow.querySelector('.message span').textContent = data.message
      }
    })

customElements.define('activation-component', Activation)
