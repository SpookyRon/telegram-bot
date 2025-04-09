class Table extends HTMLElement {

  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })

    this.data = []
  }

  async connectedCallback() {
    await this.loadData()
    await this.render()
  }

  loadData() {
    this.data = [
      {
        name: 'Carlos',
        email: 'carlossedagambin@gmail.com',
        createdAt: '2024-04-22',
        updatedAt: '2024-04-22'
      },
      {
        name: 'Carlos',
        email: 'carlossedagambin@gmail.com',
        createdAt: '2024-04-22',
        updatedAt: '2024-04-22'
      }
    ]
  }

  render() {
    this.shadow.innerHTML =
      /*html*/`
        <style> 
          
          *{
            box-sizing: border-box;
          }  

          h1, li, input, button, label {
            font-family: "Lexend", sans-serif;
            font-optical-sizing: auto;
          }
          
          .table {
            border: 1px solid #ddd;
            background-color: hsl(210, 22%, 18%);
            color: hsl(0, 0%, 94%);
            border: 1px solid hsl(210, 15%, 24%);
            display: flex;
            flex-direction: column;
            padding: 20px;
            width: 100%;            
          } 
          
          .table-header {
            background-color: hsl(210, 25%, 15%);
            padding: 10px;
            color: hsl(0, 0%, 75%);
          }

          .table-header-button{
            border: none;
            background-color: white; 
            color: hsl(210, 40%, 50%); 
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background-color 0.3s ease;
          }

          .table-header-button:hover {
            background-color: hsl(0, 0%, 87%); 
            color: white; 
          }

          .table-header-button svg{
            fill:hsl(270, 40%, 45%);
          }

          .table-register {
            background-color: hsl(210, 20%, 26%); 
            border-radius: 8px;
            padding: 15px;
          }
          
          .table-header-button{
            border: none;
            background: transparent;
            cursor: pointer;
            width: 40px;
          }

          .table-body {
            display: flex;
            flex-direction: column;
            gap:10px;
            padding: 10px;
          }

          .table-register input {
            flex: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }

          .table-register-buttons {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-bottom: 10px;
          }
                 
          .table-register button {
            width: 40px;
            justify-content: right;
            align-items: center;
            padding: 8px;
            background: hsl(0, 0%, 87%);
            color: white;
            border: none;
            cursor: pointer;
            border-radius: 5px;
          }

          .table-register-buttons button:hover {
            background-color: hsl(270, 40%, 45%);
            border-radius: 5px;
          }

          .table-register-data{
            padding: 10px;
            background-color: hsl(210, 20%, 26%);
            padding-top: 1rem;
          }

          li{
            list-style: none;
            color: hsl(0, 0%, 94%);
            line-height: 2em;
          }

          .table-footer{
            width: 100%;
          }

          .table-footer input{
            width: 100%;
            background-color: hsl(210, 25%, 15%); 
            color: hsl(0, 0%, 94%); 
            border: 1px solid hsl(210, 15%, 24%); 
            padding: 10px;
          }

        </style>
          
        <section class="table">
          <div class="table-header">
            <button class="table-header-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>filter</title><path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" /></svg>
            </button>
          </div>
          <div class= "table-body"></div>
          <div class="table-footer">
            <input type="text" readonly>
          </div>
        </section>

      `

    const tableBody = this.shadow.querySelector('.table-body');
    const tableFooterInput = this.shadow.querySelector('.table-footer input');

    this.data.forEach(user => {


      const tableRegister = document.createElement('div')
      tableRegister.classList.add('table-register')
      tableBody.appendChild(tableRegister)


      const tableRegisterButtons = document.createElement('div')
      tableRegisterButtons.classList.add('table-register-buttons')
      tableRegister.appendChild(tableRegisterButtons)

      const registerButtonPen = document.createElement('button')
      registerButtonPen.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>pen</title>
        <path d="M20.71,7.04C20.37,7.38 20.04,7.71 20.03,8.04C20,8.36 20.34,8.69 20.66,9C21.14,9.5 21.61,9.95 21.59,10.44C21.57,10.93 21.06,11.44 20.55,11.94L16.42,16.08L15,14.66L19.25,10.42L18.29,9.46L16.87,10.87L13.12,7.12L16.96,3.29C17.35,2.9 18,2.9 18.37,3.29L20.71,5.63C21.1,6 21.1,6.65 20.71,7.04M3,17.25L12.56,7.68L16.31,11.43L6.75,21H3V17.25Z"/>
      </svg>
      `

      const registerButtonTrash = document.createElement('button')
      registerButtonTrash.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M3 6h18M6 6v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6M9 6V4h6v2" 
          stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
      `

      tableRegisterButtons.appendChild(registerButtonPen)
      tableRegisterButtons.appendChild(registerButtonTrash)

      const tableRegisterData = document.createElement('div')
      tableRegisterData.classList.add('table-register-data')
      tableRegister.appendChild(tableRegisterData)

      const tableRegisterList = document.createElement('div')
      tableRegisterList.classList.add('table-register-list')
      tableRegisterData.appendChild(tableRegisterList)

      const ul = document.createElement('ul')
      tableRegisterList.appendChild(ul)

      Object.entries(user).forEach(([key, value]) => {
        const li = document.createElement('li')
        li.textContent = `${key}: ${value}`
        ul.appendChild(li)
      })
    })

    tableFooterInput.value = `${this.data.length} registros en total, mostrando 10 por página`


  }
}

customElements.define('table-component', Table);