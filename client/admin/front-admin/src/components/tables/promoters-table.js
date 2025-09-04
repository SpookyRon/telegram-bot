import { store } from '../../redux/store.js'
import { showFormElement } from '../../redux/crud-slice.js'

class PromoterTable extends HTMLElement {
  constructor() {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.endpoint = '/api/admin/promoters'
    this.filterQuery = null
    this.unsubscribe = null
  }

  async connectedCallback() {
    this.unsubscribe = store.subscribe(() => {
      const currentState = store.getState()

      if (currentState.crud.filterQuery.query && currentState.crud.filterQuery.endPoint === this.endpoint) {
        this.filterQuery = currentState.crud.filterQuery.query
        const endpoint = `${this.endpoint}?${currentState.crud.filterQuery.query}`
        this.loadData(endpoint).then(() => this.render())
      }

      if (!currentState.crud.filterQuery.query && currentState.crud.tableEndpoint === this.endpoint) {
        this.loadData().then(() => this.render())
      }
    })

    await this.loadData()
    this.render()
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }

  async loadData(endpoint = this.endpoint) {
    try {
      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`)
      }

      this.data = await response.json()
    } catch (error) {
      console.error('Error loading data:', error)
      this.data = []
    }
  }

  render() {
    this.shadow.innerHTML =
      /* html */`
      <style>
          
          *{
            box-sizing: border-box;
          }  

          ul{
            padding: 0;
            margin: 0;
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
            padding: 10px 20px;
            width: 100%;            
          } 
          
          .table-header {
            background-color: hsl(210, 25%, 15%);
            padding: 0.2rem 0.5rem;
            color: hsl(0, 0%, 75%);
          }

          .table-header-button {
            border: none;
            background: transparent; 
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
            padding: 0.5rem 1rem;
          }

          .table-body {
            display: flex;
            flex-direction: column;
            gap:10px;
            padding: 10px;
            max-height: 70vh;
            overflow-y: scroll;
          }


          .table-body::-webkit-scrollbar {
            width: 8px;
          }

          .table-body::-webkit-scrollbar-thumb {
            background-color: hsl(210, 25%, 15%);
            border-radius: 10px;
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
          }
                 
          .table-register button {
            width: 35px;
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
            background-color: hsl(210, 20%, 26%);
          }

          li{
            list-style: none;
            color: hsl(0, 0%, 94%);
          }

          .table-footer{
            align-items: center;
            background-color: hsl(210, 25%, 15%); 
            border: 1px solid hsl(210, 15%, 24%); 
            display: flex;
            justify-content: space-between;
            padding: 10px;
            width: 100%;
          }

          .table-footer span{
            color: hsl(0, 0%, 94%); 
          }

          .pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
          }

          .pagination-button {
            background: hsl(0, 0%, 87%);
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }

          .pagination-button:hover {
            background-color: hsl(270, 40%, 45%);
          }

          .pagination-button.disabled {
            background-color: hsl(210, 15%, 24%);
            cursor: not-allowed;
          }

          .pagination-button svg {
            fill: hsl(210, 25%, 15%);
            width: 24px;
            height: 24px; 
          }

        </style>
          
        <section class="table">
          <div class="table-header">
            <button class="table-header-button filter-button" aria-label="Filtrar" title="Filtrar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>filter</title><path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" /></svg>
            </button>
          </div>
          <div class= "table-body"></div>
          <div class="table-footer">
            <div class="table-footer-text">
              <span>${this.data.meta.total} ${this.data.meta.total > 1 ? 'registros' : 'registro'}. Mostrando ${this.data.meta.size} por página.</span>
            </div>
            <div class="pagination">
              <button class="pagination-button first-page  ${this.data.meta.currentPage === 1 ? 'disabled' : ''}" data-page="1" aria-label="Filtrar" title="Filtrar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>page-first</title><path d="M18.41,16.59L13.82,12L18.41,7.41L17,6L11,12L17,18L18.41,16.59M6,6H8V18H6V6Z" /></svg>      
              </button>
              <button class="pagination-button prev-page ${this.data.meta.currentPage === 1 ? 'disabled' : ''}" data-page="${this.data.meta.currentPage > 1 ? this.data.meta.currentPage - 1 : 1}" aria-label="Filtrar" title="Filtrar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-left</title><path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" /></svg>      
              </button>
              <button class="pagination-button next-page ${this.data.meta.currentPage === this.data.meta.pages ? 'disabled' : ''}"  data-page="${this.data.meta.currentPage < this.data.meta.pages ? this.data.meta.currentPage + 1 : this.data.meta.currentPage}" aria-label="Filtrar" title="Filtrar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>chevron-right</title><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>      
              </button>
              <button class="pagination-button last-page ${this.data.meta.currentPage === this.data.meta.pages ? 'disabled' : ''}" data-page="${this.data.meta.pages}" aria-label="Filtrar" title="Filtrar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>page-last</title><path d="M5.59,7.41L10.18,12L5.59,16.59L7,18L13,12L7,6L5.59,7.41M16,6H18V18H16V6Z" /></svg>      
              </button>
            </div>
          </div>
        </section>

      `
    if (this.data.rows.length === 0) {
      const tableBody = this.shadow.querySelector('.table-body')
      const message = document.createElement('span')
      message.textContent = 'No hay ningún registro'
      tableBody.appendChild(message)
    }

    const tableBody = this.shadow.querySelector('.table-body')
    tableBody.innerHTML = ''

    const filterButton = this.shadow.querySelector('.filter-button')
    if (filterButton) {
      filterButton.addEventListener('click', () => {
        store.dispatch(showFormElement('filters-form'))
      })
    }

    this.data.rows.forEach(register => {
      const tableRegister = document.createElement('div')
      tableRegister.classList.add('table-register')
      tableBody.appendChild(tableRegister)

      const tableRegisterButtons = document.createElement('div')
      tableRegisterButtons.classList.add('table-register-buttons')
      tableRegister.appendChild(tableRegisterButtons)

      const registerButtonPen = document.createElement('button')
      registerButtonPen.classList.add('edit-button')
      registerButtonPen.dataset.id = register.id

      registerButtonPen.addEventListener('click', () => {
        store.dispatch(showFormElement('edit-form', register.id))
      })
      registerButtonPen.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>pen</title>
        <path d="M20.71,7.04C20.37,7.38 20.04,7.71 20.03,8.04C20,8.36 20.34,8.69 20.66,9C21.14,9.5 21.61,9.95 21.59,10.44C21.57,10.93 21.06,11.44 20.55,11.94L16.42,16.08L15,14.66L19.25,10.42L18.29,9.46L16.87,10.87L13.12,7.12L16.96,3.29C17.35,2.9 18,2.9 18.37,3.29L20.71,5.63C21.1,6 21.1,6.65 20.71,7.04M3,17.25L12.56,7.68L16.31,11.43L6.75,21H3V17.25Z"/>
      </svg>
      `

      const registerButtonTrash = document.createElement('button')
      registerButtonTrash.classList.add('delete-button')
      registerButtonTrash.dataset.id = register.id
      registerButtonTrash.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M3 6h18M6 6v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V6M9 6V4h6v2" 
          stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      </svg>
      `
      const dataList = document.createElement('ul')
      dataList.classList.add('data-registrer-data')

      tableRegisterButtons.appendChild(registerButtonPen)
      tableRegisterButtons.appendChild(registerButtonTrash)

      const tableRegisterData = document.createElement('div')
      tableRegisterData.classList.add('table-register-data')
      tableRegister.appendChild(tableRegisterData)

      const tableRegisterList = document.createElement('div')
      tableRegisterList.classList.add('table-register-list')
      tableRegisterData.appendChild(tableRegisterList)

      const fieldLabels = {
        name: 'Nombre',
        email: 'Correo electrónico',
        createdAt: 'Fecha de creación',
        updatedAt: 'Última actualización',
      }

      const displayOrder = ['name', 'email', 'createdAt', 'updatedAt']

      const ul = document.createElement('ul')
      tableRegisterList.appendChild(ul)

      displayOrder.forEach((key) => {
        if (register[key]) {
          const listItem = document.createElement('li')
          const translatedKey = fieldLabels[key] || key
          listItem.textContent = `${translatedKey}: ${register[key]}`
          ul.appendChild(listItem)
        }

        tableRegisterData.appendChild(dataList)
      })

      this.renderButtons()
    })
    

    renderButtons() {
      this.attachEventListeners()
    }

    this.attachEventListeners() {
      this.shadow.querySelectorAll('.pagination-button').forEach(button => {
        if (!button.classList.contains('disabled')) {
          button.addEventListener('click', async (e) => {
            const page = button.dataset.page
            await this.loadData(`${this.endpoint}?page=${page}`)
            this.render()
          })
        }
      })
    }

      this.shadow.querySelector('.table').addEventListener('click', async event => {
        if (event.target.closest('.edit-button')) {
          const element = event.target.closest('.edit-button')
          const id = element.dataset.id
          const endpoint = `${this.endpoint}/${id}`

          try {
            const response = await fetch(endpoint)

            if (response.status === 500 || response.status === 404) {
              throw response
            }

            const data = await response.json()

            const formElement = {
              endPoint: this.endpoint,
              data
            }

            store.dispatch(showFormElement(formElement))
          } catch (error) {
            document.dispatchEvent(new CustomEvent('notice', {
              detail: {
                message: 'No se han podido recuperar el dato',
                type: 'error'
              }
            }))
          }
        }

        if (event.target.closest('.delete-button')) {
          const element = event.target.closest('.delete-button')
          const id = element.dataset.id

          document.dispatchEvent(new CustomEvent('showDeleteModal', {
            detail: {
              endpoint: this.endpoint,
              elementId: id
            }
          }))
        }

        if (event.target.closest('.filter-button')) {
          document.dispatchEvent(new CustomEvent('showFilterModal'))
        }

        if (event.target.closest('.pagination-button') && !event.target.closest('.pagination-button').classList.contains('disabled')) {
          const page = event.target.closest('.pagination-button').dataset.page
          let endpoint = `${this.endpoint}?page=${page}`

          if (this.filterQuery) {
            endpoint = `${endpoint}&${this.filterQuery}`
          }

          this.loadData(endpoint).then(() => this.render())
        }

        if (event.target.closest('.filter-button')) {
          document.dispatchEvent(new CustomEvent('showFilterModal', {
            detail: {
              endpoint: this.endpoint
            }
          }))
        }
        const paginationButtons = this.shadow.querySelectorAll('.pagination-button:not(.disabled)')
        paginationButtons.forEach(button => {
          button.addEventListener('click', async () => {
            const page = button.dataset.page
            const endpointWithPage = this.filterQuery
              ? `${this.endpoint}?${this.filterQuery}&page=${page}`
              : `${this.endpoint}?page=${page}`
            await this.loadData(endpointWithPage)
            this.render()
          })
        })
      })
    }
  }


customElements.define('promoters-table-component', PromoterTable)
