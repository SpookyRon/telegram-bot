class Login extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
  }

  async connectedCallback () {
    await this.render()
  }

  render () {
    this.shadow.innerHTML =
    /* html */`
    <style>
      .login-btn {
        position: absolute;
        z-index: 1000;
        right: 0;
        display: flex;
        justify-content: center;
        margin: 20px;
      }

      .login-btn button {
        color: white;
        background: #2563eb;
        border: none;
        border-radius: 6px;
        padding: 10px 20px;
        cursor: pointer;
      }

      .login-btn button:hover {
        background:rgb(0, 174, 255);
      }

      .login-btn a {
        color: #ffffff;
        text-decoration: none;
        font-size: 15px;
        font-weight: 500;
        display: block;
      }
    </style>

    <div class="login-btn">
      
        <a href="/login"><button>Login</button></a>
      
    </div>

    `
  }
}

customElements.define('login-component', Login)
