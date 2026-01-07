class ChatDiscord extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.socket = new WebSocket(import.meta.env.VITE_WS_URL || 'ws://localhost:8080')
    this.socketReady = false
    this.userName = localStorage.getItem('usuarioName') || null
  }

  connectedCallback () {
    this.render()
    this.addEventListeners()

    if (!this.userName) {
      this.shadow.querySelector('.modal-welcome').classList.add('visible')
    } else {
      this.updateUserUI(this.userName)
    }

    this.socket.addEventListener('open', () => {
      this.socketReady = true
      this.wsSubscribe('colectivo')
      if (this.userName) {
        this.wsSend({
          channel: 'colectivo',
          data: JSON.stringify({ event: 'user_connected', data: { user: this.userName } })
        })
      }
    })

    this.socket.addEventListener('message', event => {
      const data = JSON.parse(event.data)
      if (data.channel === 'colectivo') {
        try {
          const inner = JSON.parse(data.data)
          if (inner.event === 'new_message' && inner.data.user !== this.userName) {
            this.createIncomingMessage(inner.data.user, inner.data.prompt)
          } else if (inner.event === 'user_connected') {
            this.createSystemMessage(`👋 ${inner.data.user} se ha conectado.`)
          }
        } catch (err) {
          console.error('❌ Error parseando mensaje WS', err)
        }
      }
    })

    this.socket.addEventListener('close', () => { this.socketReady = false })
    this.socket.addEventListener('error', () => { this.socketReady = false })
  }

  // --- Métodos para WebSockets ---
  wsSend (obj) {
    if (!this.socketReady) return
    this.socket.send(JSON.stringify(obj))
  }

  wsSubscribe (channel) { this.wsSend({ type: 'subscribe', channel }) }

  // --- Lógica del Chat ---
  sendMessage () {
    const chatInput = this.shadow.querySelector('.chat-input')
    const message = chatInput.value.trim()
    if (!message || !this.userName) return

    this.createUserMessage(this.userName, message)
    chatInput.value = ''
    chatInput.focus()

    const payload = {
      channel: 'colectivo',
      data: JSON.stringify({ event: 'new_message', data: { prompt: message, user: this.userName } })
    }
    this.wsSend(payload)
  }

  createIncomingMessage (user, text) {
    this.removeWelcomeMessage()
    const chatMessages = this.shadow.querySelector('.chat-messages')
    const messageHTML = `
      <div class="prompt incoming">
        <div class="avatar">${user[0].toUpperCase()}</div>
        <div class="message-content"><h3>${user}</h3><p>${text}</p></div>
      </div>`
    chatMessages.insertAdjacentHTML('beforeend', messageHTML)
    this.scrollToBottom()
  }

  createUserMessage (user, text) {
    this.removeWelcomeMessage()
    const chatMessages = this.shadow.querySelector('.chat-messages')
    const messageHTML = `
      <div class="prompt user">
        <div class="avatar user-avatar">${user[0].toUpperCase()}</div>
        <div class="message-content"><h3>${user}</h3><p>${text}</p></div>
      </div>`
    chatMessages.insertAdjacentHTML('beforeend', messageHTML)
    this.scrollToBottom()
  }

  createSystemMessage (text) {
    const chatMessages = this.shadow.querySelector('.chat-messages')
    const sysMsg = document.createElement('div')
    sysMsg.className = 'system-message'
    sysMsg.textContent = text
    chatMessages.appendChild(sysMsg)
    this.scrollToBottom()
  }

  removeWelcomeMessage () {
    const welcome = this.shadow.querySelector('.welcome-message')
    if (welcome) welcome.remove()
  }

  scrollToBottom () {
    const chatMessages = this.shadow.querySelector('.chat-messages')
    chatMessages.scrollTop = chatMessages.scrollHeight
  }

  // --- Manejo de Usuario y Modales ---
  handleSetUsername (modalSelector, inputSelector) {
    const modal = this.shadow.querySelector(modalSelector)
    const input = this.shadow.querySelector(inputSelector)
    const newName = input.value.trim()

    if (newName) {
      const oldName = this.userName
      this.userName = newName
      localStorage.setItem('usuarioName', newName)

      this.updateUserUI(newName)

      if (oldName && oldName !== newName) {
        this.createSystemMessage(`Has cambiado tu nombre a "${newName}".`)
      } else if (!oldName) {
        this.wsSend({
          channel: 'colectivo',
          data: JSON.stringify({ event: 'user_connected', data: { user: newName } })
        })
      }

      modal.classList.remove('visible')
    } else {
      input.placeholder = '¡El nombre no puede estar vacío!'
      input.focus()
    }
  }

  updateUserUI (name) {
    const userAvatar = this.shadow.querySelector('.footer-user-avatar')
    if (userAvatar) {
      userAvatar.textContent = name[0].toUpperCase()
    }
  }

  // --- Renderizado y Eventos ---
  addEventListeners () {
    this.shadow.querySelector('.send-button').addEventListener('click', () => this.sendMessage())
    this.shadow.querySelector('.chat-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendMessage() }
    })

    this.shadow.querySelector('.welcome-modal-button').addEventListener('click', () => {
      this.handleSetUsername('.modal-welcome', '.welcome-modal-input')
    })
    this.shadow.querySelector('.welcome-modal-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSetUsername('.modal-welcome', '.welcome-modal-input')
    })

    this.shadow.querySelector('.footer-user-button').addEventListener('click', () => {
      this.shadow.querySelector('.change-name-modal-input').value = this.userName
      this.shadow.querySelector('.modal-change-name').classList.add('visible')
    })
    this.shadow.querySelector('.change-name-modal-button').addEventListener('click', () => {
      this.handleSetUsername('.modal-change-name', '.change-name-modal-input')
    })
    this.shadow.querySelector('.change-name-modal-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSetUsername('.modal-change-name', '.change-name-modal-input')
    })

    this.shadow.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) { modal.classList.remove('visible') }
      })
    })
  }

  render () {
    this.shadow.innerHTML = /* html */`
      <style>
        :host { display: flex; flex-direction: column; height: 100dvh; background-color: #151515; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        * { padding: 0; margin: 0; box-sizing: border-box; }
        .discord-container { display: flex; flex: 1; overflow: hidden; }
        .left-panel { padding: 0.5rem 0; align-items: center; width: 60px; display: flex; flex-direction: column; background-color: #151515; gap: 1rem; }
        .left-panel .icon-general svg { cursor: pointer; height: 25px; width: auto; color: white; background: linear-gradient(135deg, #6f00ff, #9d4dff); padding: 0.5rem; border-radius: 0.8rem; }
        .left-panel .icon-create svg { background-color: #340164; color: #6f00ff; border: 2px solid #6f00ff; border-radius: 2rem; padding: 0.5rem; cursor: pointer; transition: all 0.2s; }
        .left-panel .icon-create svg:hover { background: linear-gradient(135deg, #6f00ff, #9d4dff); color: white; border-color: white; }
        .right-panel { flex: 1; display: flex; flex-direction: column; background-color: #1d1d1d; border-top-left-radius: 8px; border-bottom-left-radius: 8px; overflow: hidden; }
        .chat-header { padding: 1rem 1.5rem; border-bottom: 1px solid #282828; color: white; font-weight: bold; }
        .chat-messages { color: white; flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 1.2rem; }
        .chat-messages::-webkit-scrollbar { width: 6px; }
        .chat-messages::-webkit-scrollbar-track { background: hsl(0, 0%, 20%); }
        .chat-messages::-webkit-scrollbar-thumb { background: hsl(0, 0%, 50%); border-radius: 3px; }
        .welcome-message, .system-message { text-align: center; color: hsl(0, 0%, 60%); font-size: 0.9rem; margin: auto; }
        .prompt { display: flex; gap: 1rem; align-items: flex-start; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #6f00ff, #9d4dff); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
        .avatar.user-avatar { background: linear-gradient(135deg, #3498db, #2980b9); }
        .message-content h3 { font-size: 1rem; margin: 0 0 0.25rem; color: #f2f2f2; }
        .message-content p { font-size: 1rem; margin: 0; color: #dcdcdc; line-height: 1.5; white-space: pre-wrap; }
        .input-area { padding: 1rem 1.5rem; background: #1d1d1d; display: flex; gap: 10px; align-items: center; }
        .chat-input { flex: 1; padding: 12px 16px; border: 1px solid hsl(0, 0%, 40%); border-radius: 8px; font-size: 1rem; outline: none; transition: border-color 0.2s; background: hsl(0, 0%, 14%); color: white; }
        .chat-input:focus { border-color: #6f00ff; }
        .send-button { background: linear-gradient(135deg, #6f00ff, #9d4dff); color: white; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 16px; flex-shrink: 0; }
        .footer { height: 4.5rem; background-color: #1d1d1d; color: rgb(160, 160, 160); font-size: 0.8rem; border-top: 1px solid #3b3b3b; }
        .footer ul { height: 100%; padding: 0.5rem; display: grid; grid-template-columns: repeat(3, 1fr); list-style: none; justify-items: center; align-items: center; }
        .footer li { cursor: pointer; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
        .footer li.active { color: white; }
        .footer svg { height: 25px; width: auto; }
        .footer-user-icon-wrapper { position: relative; width: 25px; height: 25px; margin-bottom: 2px; }
        .footer-user-avatar { width: 100%; height: 100%; background-color: #4a4a4a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; }
        .status { position: absolute; bottom: -2px; right: -2px; height: 10px; width: 10px; border-radius: 50%; border: 2px solid #1d1d1d; }
        .status.disponible { background-color: #008000; }
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
        .modal-overlay.visible { opacity: 1; pointer-events: auto; }
        .modal-content { background: #2c2f33; color: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 400px; text-align: center; }
        .modal-content h2 { margin-bottom: 1rem; }
        .modal-content p { margin-bottom: 1.5rem; color: #b9bbbe; }
        .modal-input { width: 100%; padding: 12px; border-radius: 5px; border: 1px solid #4f545c; background: #40444b; color: white; font-size: 1rem; margin-bottom: 1.5rem; }
        .modal-button { width: 100%; padding: 12px; border: none; border-radius: 5px; background: #7289da; color: white; font-size: 1rem; font-weight: bold; cursor: pointer; transition: background-color 0.2s; }
        .modal-button:hover { background: #677bc4; }
      </style>

      <!-- MODAL DE BIENVENIDA -->
      <div class="modal-overlay modal-welcome">
        <div class="modal-content">
          <h2>¡Bienvenido al Chat!</h2>
          <p>Para continuar, por favor introduce tu nombre de usuario.</p>
          <input type="text" class="modal-input welcome-modal-input" placeholder="Tu nombre...">
          <button class="modal-button welcome-modal-button">Entrar al Chat</button>
        </div>
      </div>
      
      <!-- MODAL PARA CAMBIAR NOMBRE -->
      <div class="modal-overlay modal-change-name">
        <div class="modal-content">
          <h2>Cambiar Nombre</h2>
          <p>Introduce tu nuevo nombre de usuario.</p>
          <input type="text" class="modal-input change-name-modal-input">
          <button class="modal-button change-name-modal-button">Guardar Cambios</button>
        </div>
      </div>

      <!-- ESTRUCTURA PRINCIPAL DEL CHAT -->
      <div class="discord-container">
        <div class="left-panel">
          <div class="icon-general"><svg viewBox="0 0 1024 1024"><path fill="currentColor" d="M924.3 338.4a447.6 447.6 0 0 0-96.1-143.3a443.1 443.1 0 0 0-143-96.3A443.9 443.9 0 0 0 512 64h-2c-60.5.3-119 12.3-174.1 35.9a444.1 444.1 0 0 0-141.7 96.5a445 445 0 0 0-95 142.8A449.9 449.9 0 0 0 65 514.1c.3 69.4 16.9 138.3 47.9 199.9v152c0 25.4 20.6 46 45.9 46h151.8a447.7 447.7 0 0 0 199.5 48h2.1c59.8 0 117.7-11.6 172.3-34.3A443.2 443.2 0 0 0 827 830.5c41.2-40.9 73.6-88.7 96.3-142c23.5-55.2 35.5-113.9 35.8-174.5c.2-60.9-11.6-120-34.8-175.6M312.4 560c-26.4 0-47.9-21.5-47.9-48s21.5-48 47.9-48s47.9 21.5 47.9 48s-21.4 48-47.9 48m199.6 0c-26.4 0-47.9-21.5-47.9-48s21.5-48 47.9-48s47.9 21.5 47.9 48s-21.5 48-47.9 48m199.6 0c-26.4 0-47.9-21.5-47.9-48s21.5-48 47.9-48s47.9 21.5 47.9 48s-21.5 48-47.9 48"/></svg></div>
          <div class="icon-create"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"/></svg></div>
        </div>
        <div class="right-panel">
          <header class="chat-header"># General</header>
          <div class="chat-messages">
            <div class="welcome-message">Introduce tu nombre para empezar a chatear.</div>
          </div>
          <div class="input-area">
            <textarea type="text" class="chat-input" placeholder="Escribe tu mensaje en #General..." required></textarea>
            <button class="send-button" title="Enviar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22,2 15,22 11,13 2,9"></polygon></svg></button>
          </div>
        </div>
      </div>

      <!-- FOOTER CON HTML CORREGIDO -->
      <footer class="footer">
        <ul>
          <li class="active">
            <svg viewBox="0 0 512 512"><path fill="currentColor" d="M234.2 8.6c12.3-11.4 31.3-11.4 43.5 0L368 92.3V80c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32v101.5l37.8 35.1c9.6 9 12.8 22.9 8 35.1S493.2 272 480 272h-16v176c0 35.3-28.7 64-64 64H112c-35.3 0-64-28.7-64-64V272H32c-13.2 0-25-8.1-29.8-20.3s-1.6-26.2 8-35.1zM216 224c-13.3 0-24 10.7-24 24v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24v-80c0-13.3-10.7-24-24-24z"/></svg>
            <div>Inicio</div>
          </li>
          <li>
            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.352 20.242A4.63 4.63 0 0 0 12 22a4.63 4.63 0 0 0 3.648-1.758a27.2 27.2 0 0 1-7.296 0M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.8 25.8 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.4 4.4 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"/></svg>
            <div>Notificaciones</div>
          </li>
          <li class="footer-user-button">
            <div class="footer-user-icon-wrapper">
              <div class="footer-user-avatar">${this.userName ? this.userName[0].toUpperCase() : '?'}</div>
              <div class="status disponible"></div>
            </div>
            <div>Tú</div>
          </li>
        </ul>
      </footer>
    `
  }
}

customElements.define('chat-component', ChatDiscord)
