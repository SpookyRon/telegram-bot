class NotFound extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
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
        padding: 0;
      }

      :host {
        display: block;
        min-height: 100vh;
        background: linear-gradient(to bottom, hsl(0, 0%, 98%), hsl(220, 80%, 90%));
        font-family: "Nunito Sans", sans-serif;
        color: #333;
        overflow: hidden;
        position: relative;
      }

      .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        text-align: center;
        padding: 2rem;
        gap: 2rem;
      }

      h1 {
        font-size: 6rem;
        color: hsl(220, 50%, 30%);
      }

      p {
        font-size: 1.5rem;
        color: hsl(220, 30%, 20%);
      }

      .cats {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
      }

      .cat {
        position: absolute;
        font-size: 2rem;
        transform: rotate(var(--rotation));
        animation: float 5s ease-in-out infinite;
        opacity: 0.8;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(var(--rotation)); }
        50% { transform: translateY(-20px) rotate(var(--rotation)); }
      }

    </style>

    <div class="container">
      <h1>404</h1>
      <p>¡Oh no! Esta página está llena de gatitos asustados.<br>Pero no lo que buscabas...</p>
    </div>

    <div class="cats">
      ${this.generateCats(20)}
    </div>
    `
  }

  generateCats (n) {
    const emojis = ['🐱', '😿', '🙀', '😾']
    const getRandom = (min, max) => Math.random() * (max - min) + min
    let cats = ''
    for (let i = 0; i < n; i++) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)]
      const top = getRandom(0, 90)
      const left = getRandom(0, 90)
      const rotation = `${getRandom(-30, 30)}deg`
      cats += `<div class="cat" style="top: ${top}%; left: ${left}%; --rotation: ${rotation}">${emoji}</div>`
    }
    return cats
  }
}

customElements.define('notfound-component', NotFound)
