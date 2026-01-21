class Panels extends HTMLElement {
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
      :host{
        display: block;
      }

      .dashboard {
        font-family: "Nunito Sans", serif;
        font-optical-sizing: auto;

        padding: 24px;
        width: 80%;
        margin: 0 auto;

        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .panel {
        background-color: hsl(0, 0%, 100%);
        border: 2px solid hsl(200, 77%, 52%);
        border-radius: 12px;
        padding: 14px 16px;

        display: flex;
        align-items: center;
        justify-content: space-between;

        box-shadow: 0 10px 22px hsla(200, 87%, 15%, 0.12);
      }

      .panel-content h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 800;
        color: hsl(200, 87%, 15%);
      }

      .panel-content p {
        margin: 6px 0 0;
        font-size: 13px;
        font-weight: 600;
        color: hsl(0, 0%, 50%);
        line-height: 1.4;
      }

      .panel-action {
        width: 42px;
        height: 42px;
        border-radius: 999px;
        border: none;

        background-color: hsl(200, 77%, 52%);
        color: hsl(0, 0%, 100%);

        cursor: pointer;

        display: flex;
        align-items: center;
        justify-content: center;

        transition: transform 120ms ease, background-color 120ms ease;
      }

      .panel-action:hover {
        background-color: hsl(200, 77%, 42%);
        transform: translateY(-1px);
      }

      .panel-action:active {
        transform: translateY(0px);
      }

      .panel-action svg {
        width: 24px;
        height: auto;
      }
    </style>

    <div class="dashboard">
      <div class="panel">
        <div class="panel-content">
          <h3>Suscripciones</h3>
          <p>Gestiona y edita tus suscripciones</p>
        </div>
        <button class="panel-action" aria-label="Ir a Suscripciones">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>

      <div class="panel">
        <div class="panel-content">
          <h3>Planes</h3>
          <p>Consulta tus planes adquiridos</p>
        </div>
        <button class="panel-action" aria-label="Ir a Planes">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
    </div>
    `
  }
}

customElements.define('panels-component', Panels)
