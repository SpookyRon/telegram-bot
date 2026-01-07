class RoiSelection extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.storeEndpoint = ''
    this.getEndpoint = ''
    this.frameEndpoint = ''
    this.image = null
    this.points = []
    this.regionsOfInterest = []
  }

  connectedCallback () {
    document.addEventListener('openRoiSelection', this.handleOpenRoiSelection.bind(this))
    this.render()
  }

  async handleOpenRoiSelection (event) {
    let storeEndpoint = import.meta.env.VITE_API_URL + event.detail.endpoint + '/store-roi-selection/' + event.detail.id
    let updateEndpoint = import.meta.env.VITE_API_URL + event.detail.endpoint + '/update-roi-selection/' + event.detail.id
    let deleteEndpoint = import.meta.env.VITE_API_URL + event.detail.endpoint + '/delete-roi-selection/' + event.detail.id
    let getEndpoint = import.meta.env.VITE_API_URL + event.detail.endpoint + '/get-roi-selections/' + event.detail.id
    let frameEndpoint = import.meta.env.VITE_API_URL + event.detail.endpoint + '/show-source-frame/' + event.detail.id

    const query = [
      event.detail.parent ? `parent=${event.detail.parent.id}` : null
    ].filter(Boolean).join('&')

    frameEndpoint += query ? `?${query}` : ''
    storeEndpoint += query ? `?${query}` : ''
    updateEndpoint += query ? `?${query}` : ''
    deleteEndpoint += query ? `?${query}` : ''
    getEndpoint += query ? `?${query}` : ''

    this.storeEndpoint = storeEndpoint
    this.updateEndpoint = updateEndpoint
    this.deleteEndpoint = deleteEndpoint
    this.getEndpoint = getEndpoint
    this.frameEndpoint = frameEndpoint

    this.OpenRoiSelection()
  }

  async loadRegions () {
    try {
      const response = await fetch(this.getEndpoint)
      this.regionsOfInterest = await response.json()

      this.regionsOfInterest.forEach(regionOfInterest => {
        this.drawRegion(regionOfInterest)
      })
    } catch (error) {
      document.dispatchEvent(new CustomEvent('message', {
        detail: {
          message: 'Fallo al cargar las areas de interés',
          type: 'error'
        }
      }))
    }
  }

  async render () {
    this.shadow.innerHTML =
      /* html */`
        <style>
          * {
            box-sizing: border-box;
          }

          .overlayer {
            align-items: center;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            height: 100vh;
            justify-content: center;
            left: 0;
            opacity: 0;
            position: fixed;
            top: 0;
            transition: opacity 0.3s;
            visibility: hidden;
            width: 100%;
            z-index: -1;
          }

          .overlayer.active {
            opacity: 1;
            visibility: visible;
            z-index: 5000;
          }

          .modal {
            height: 100%;
            position: absolute;
            width: 100%;
          }

          .modal-content {
            background-color: white;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
            display: flex;
            flex-direction: column;
            height: 100%;
            position: relative;
            width: 100%;
          }

          .modal-header {
            align-items: center;
            background-color: hsl(236 55% 25%);
            display: flex;
            height: 5%;
            justify-content: space-between;
            padding: 2rem 1%;
            width: 100%;
          }

          .modal-header .modal-header-title h2 {
            color: hsl(0, 0%, 100%);
            font-family: 'Lato', sans-serif;
            margin: 0;
          }

          .modal-header .modal-header-buttons {
            align-items: center;
            display: flex;
            gap: 1rem;
          }

          .modal-header .close-button span {
            color: hsl(0, 0%, 100%);
            font-size: 3rem;
            font-weight: bold;
          }

          .modal-header .close-button:hover span,
          .modal-header .close-button:focus span {
            text-decoration: none;
            cursor: pointer;
          }

          .modal-header .show-list-button{
            align-items: center;
            display: flex;
          }

          .modal-header .show-list-button:hover svg,
          .modal-header .show-list-button:focus svg {
            cursor: pointer;
          }

          .modal-header .show-list-button svg {
            fill: hsl(0, 0%, 100%);
            height: 2rem;
            width: 2rem;
          }

          .modal-body {
            border-top: 2px solid hsl(0, 0%, 90%);
            display: flex;
            height: 100%;
            position: relative;
          }

          .roi-selection-area {
            align-content: flex-start;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            overflow: scroll;
            overscroll-behavior: contain;
            position: relative;
            width: 100%;
          }

          .roi-selection-area::-webkit-scrollbar{
            width: 0.7rem; 
          }

          .roi-selection-area::-webkit-scrollbar-thumb{
            background-color: hsl(236 55% 25%);
          }

          .roi-selection-area::-webkit-scrollbar-thumb:hover{
            background-color: hsl(272 40% 35%);
          }

          .roi-selection-area .loader.active{
            align-items: center;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            height: 100%;
            justify-content: center;
            width: 100%;
          }

          .roi-selection-area .loader{
            display: none;
          }

          .roi-selection-area .loader span {
            animation: rotation 1s linear infinite;
            border: 5px solid hsl(236 55% 25%);
            border-bottom-color: transparent;
            border-radius: 50%;
            box-sizing: border-box;
            display: inline-block;
            height: 48px;
            width: 48px;
          }

          @keyframes rotation {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          } 

          .roi-selection-area .loader h5{
            color: hsl(0, 0%, 40%);
            font-family: 'Lato', sans-serif;
            font-size: 1.2rem;
            margin: 0;
            text-align: center;
          }

          .roi-selection-area-form-overlay {
            align-items: center;
            background-color: rgba(0, 0, 0, 0.5);
            border-top: 1px solid hsl(0, 0%, 90%);
            display: flex;
            flex-direction: column;
            gap: 1rem;
            height: 100%;
            justify-content: center;
            position: absolute;
            opacity: 0;
            transition: visibility 0.3s, opacity 0.3s;
            visibility: hidden;
            width: 100%;
            z-index: 6000;
          }

          .roi-selection-area-form-overlay.active {
            opacity: 1;
            visibility: visible;
          }

          .roi-selection-area-form{
            background-color: hsl(272deg 40% 35%);
            display: flex;
            flex-direction: column;
            gap: 2rem;
            padding: 1rem;
          }

          .roi-selection-area-form-header h3 {
            color: hsl(0, 0%, 100%);
            font-family: 'Lato', sans-serif;
            margin: 0;
            text-align: center;
          }

          .roi-selection-area-form-body form{
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .form-element {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .form-element-label label {
            color: hsl(0, 0%, 100%);
            font-family: 'Lato', sans-serif;
            font-size: 1rem;
          }

          .form-element-input input{
            outline: none;
          }

          .form-element-input input[type="text"] {
            border-bottom: 1px solid hsl(0, 0%, 100%);
            background-color: hsl(226deg 64% 66%);
            color: hsl(0, 0%, 100%);
            font-family: 'Lato', sans-serif;
            font-size: 1rem;
            padding: 0.5rem;
            width: 100%;
          }

          .form-element-input-checkbox {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 1rem;
          }

          .form-element-checkbox label {
            color: hsl(0, 0%, 100%);
            font-family: 'Lato', sans-serif;
            font-size: 1rem;
          }

          .form-element-checkbox input {
            border: 1px solid hsl(0, 0%, 90%);
            border-radius: 5px;
            font-family: 'Lato', sans-serif;
            font-size: 1rem;
            padding: 0.5rem;
          }

          .roi-selection-area-form-footer{
            align-items: center;
            display: flex;
            justify-content: center;
            gap: 1rem;
          }

          .store-button button {
            background-color: hsl(0, 65%, 55%);
            border: none;
            color: hsl(0, 0%, 100%);
            font-family: 'Lato', sans-serif;
            font-size: 1rem;
            font-weight: 600;
            outline: none;
            padding: 0.5rem 1rem;
          }

          .store-button button:hover {
            filter: brightness(1.2);
            cursor: pointer;
          }

          .cancel-button button {
            background-color: hsl(183, 98%, 35%);
            border: none;
            color: hsl(0, 0%, 100%);
            font-family: 'Lato', sans-serif;
            font-size: 1rem;
            font-weight: 600;
            outline: none;
            padding: 0.5rem 1rem;
          }

          .cancel-button button:hover {
            filter: brightness(1.2);
            cursor: pointer;
          }

          .roi-list {
            background-color: hsl(272deg 40% 35%);
            display: flex;
            flex-direction: column;
            gap: 1rem;
            height: 100%;
            padding: 1rem;
            position: absolute;
            top: 0;
            right: -20%;
            transition: right 0.3s;
            width: 20%;
            z-index: 7000;
          }

          .roi-list.active{
            right: 0;
          }

          .roi-list-header h3 {
            color: hsl(0, 0%, 100%);
            font-family: 'Lato', sans-serif;
            margin: 0;
            text-align: center;
          }

          .roi-list-body {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .region {
            display: flex;
            flex-direction: column;
          }

          .region .region-header {
            align-items: center;
            background-color: hsl(0, 0%, 100%);
            display: flex;
            justify-content: flex-end;
            padding: 0.2rem;
          }

          .region-header .region-buttons {
            align-items: center;
            display: flex;
            gap: 0.5rem;
          }

          .region .view-button,
          .region .delete-button{
            cursor: pointer;
          }

          .region .view-button svg,
          .region .delete-button svg{
            fill: hsl(236 55% 25%);
            height: 1.5rem;
            width: 1.5rem;
          }

          .region .view-button:hover svg,
          .region .delete-button:hover svg{
            fill: hsl(272 40% 35%);
          }

          .region .region-body {
            background-color: hsl(0, 0%, 0%);
            padding: 0.5rem;
          }

          .region .region-body ul {
            display: flex;
            flex-direction: column;
            gap: 0.2rem;
            list-style: none;
            margin: 0;
            padding: 0;
          }

          .region-body ul li {
            color: hsl(0, 0%, 100%);
            font-family: 'Lato', sans-serif;
            font-size: 1rem;
            font-weight: 600;
            text-wrap: wrap;
          }
        </style>

        <div class="overlayer">
          <div class="modal">
            <div class="modal-content">
              <div class="modal-header">
                <div class="modal-header-title">
                  <h2>Seleccionar areas de interés</h2>
                </div>
                <div class="modal-header-buttons">
                  <div class="show-list-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M21,19V17H8V19H21M21,13V11H8V13H21M8,7H21V5H8V7M4,5V7H6V5H4M3,5A1,1 0 0,1 4,4H6A1,1 0 0,1 7,5V7A1,1 0 0,1 6,8H4A1,1 0 0,1 3,7V5M4,11V13H6V11H4M3,11A1,1 0 0,1 4,10H6A1,1 0 0,1 7,11V13A1,1 0 0,1 6,14H4A1,1 0 0,1 3,13V11M4,17V19H6V17H4M3,17A1,1 0 0,1 4,16H6A1,1 0 0,1 7,17V19A1,1 0 0,1 6,20H4A1,1 0 0,1 3,19V17Z" />
                    </svg>                  
                  </div>
                  <div class="close-button">
                    <span>&times;</span>
                  </div>
                </div>
              </div>
              <div class="modal-body">
                <div class="roi-list">
                  <div class="roi-list-header">
                    <h3>Areas seleccionadas</h3>
                  </div>
                  <div class="roi-list-body"></div>
                </div>
                <div class="roi-selection-area">
                  <div class="loader active">
                    <span></span>
                    <h5>Cargando captura de la fuente...</h5>
                  </div>
                  <canvas width="800" height="600"></canvas>
                  <div class="roi-selection-area-form-overlay">
                    <div class="roi-selection-area-form">
                      <div class="roi-selection-area-form-header">
                        <h3>Propiedades del area</h3>
                      </div>
                      <div class="roi-selection-area-form-body">
                        <form>
                          <input type="hidden" id="roi-id" name="id">
                          <div class="form-element"> 
                            <div class="form-element-label">
                              <label for="area-name">Nombre del area</label>
                            </div>
                            <div class="form-element-input">
                              <input type="text" id="area-name" name="area-name" required>
                            </div>
                          </div>
                          <div class="form-element">
                            <div class="form-element-label">
                              <label for="object-detection">Objetos a detectar</label>
                            </div>
                            <div class="form-element-input-checkbox">
                              <div class="form-element-checkbox">
                                <label for="person">Personas</label>
                                <input type="checkbox" id="person" name="objects" value="person">
                              </div>
                              <div class="form-element-checkbox">
                                <label for="car">Coches</label>
                                <input type="checkbox" id="car" name="objects" value="car">
                              </div>
                              <div class="form-element-checkbox">
                                <label for="car">Camiones</label>
                                <input type="checkbox" id="truck" name="objects" value="truck">
                              </div>
                              <div class="form-element-checkbox">
                                <label for="traffic">Trafico</label>
                                <input type="checkbox" id="traffic" name="objects" value="traffic">
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <div class="roi-selection-area-form-footer">
                        <div class="store-button">
                          <button>Guardar area</button>
                        </div>
                        <div class="cancel-button">
                          <button>Cancelar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        `

    this.shadow.querySelector('.overlayer').addEventListener('click', (event) => {
      if (event.target.closest('.show-list-button')) {
        this.renderList(true)
      }

      if (event.target.closest('.close-button')) {
        this.closeGallery()
      }

      if (event.target.closest('.store-button')) {
        this.saveRegionOfInterest()
      }

      if (event.target.closest('.cancel-button')) {
        this.cancelRegion()
      }

      if (event.target.closest('.view-button')) {
        this.viewRegionOfInterest(event.target.closest('.view-button').dataset.id)
      }

      if (event.target.closest('.delete-button')) {
        this.deleteRegionOfInterest(event.target.closest('.delete-button').dataset.id)
      }
    })

    this.shadow.querySelector('canvas').addEventListener('click', this.handleCanvasClick.bind(this))
  }

  renderList (openList = false) {
    if (openList) {
      const roiList = this.shadow.querySelector('.roi-list')
      roiList.classList.toggle('active')
    }

    const roiListBody = this.shadow.querySelector('.roi-list-body')
    roiListBody.innerHTML = ''

    this.regionsOfInterest.forEach(regionOfInterest => {
      const region = document.createElement('div')
      region.classList.add('region')
      roiListBody.appendChild(region)

      const regionHeader = document.createElement('div')
      regionHeader.classList.add('region-header')
      region.appendChild(regionHeader)

      const regionButtons = document.createElement('div')
      regionButtons.classList.add('region-buttons')
      regionHeader.appendChild(regionButtons)

      const viewButton = document.createElement('div')
      viewButton.classList.add('view-button')
      viewButton.dataset.id = regionOfInterest.id
      viewButton.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
        </svg>
      `
      regionButtons.appendChild(viewButton)

      const deleteButton = document.createElement('div')
      deleteButton.classList.add('delete-button')
      deleteButton.dataset.id = regionOfInterest.id
      deleteButton.innerHTML = `
        <svg viewBox="0 0 24 24">
          <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
        </svg>`
      regionButtons.appendChild(deleteButton)

      const regionBody = document.createElement('div')
      regionBody.classList.add('region-body')
      region.appendChild(regionBody)

      const regionData = document.createElement('ul')
      regionBody.appendChild(regionData)

      const regionName = document.createElement('li')
      regionName.textContent = `Nombre del area: ${regionOfInterest.regionName}`
      regionData.appendChild(regionName)

      const regionObjects = document.createElement('li')
      regionObjects.classList.add('region-objects')
      regionObjects.textContent = `Objetos a detectar: ${regionOfInterest.objects.join(', ')}`
      regionData.appendChild(regionObjects)
    })
  }

  async OpenRoiSelection () {
    try {
      this.shadow.querySelector('.overlayer').classList.add('active')

      const canvas = this.shadow.querySelector('canvas')
      const ctx = canvas.getContext('2d')
      this.image = new Image()
      this.image.src = this.frameEndpoint

      this.image.onload = async () => {
        this.shadow.querySelector('.loader').classList.remove('active')
        canvas.width = this.image.width
        canvas.height = this.image.height
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height)
        await this.loadRegions()
      }
    } catch (error) {
      document.dispatchEvent(new CustomEvent('message', {
        detail: {
          message: 'Fallo al conectar con la fuente de visión',
          type: 'error'
        }
      }))
    }
  }

  handleCanvasClick (event) {
    const canvas = this.shadow.querySelector('canvas')
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    this.points.push({ x, y })
    this.drawPoint(x, y)

    if (this.points.length === 4) {
      this.shadow.querySelector('.roi-selection-area-form-overlay').classList.add('active')
    }
  }

  async saveRegionOfInterest () {
    const roiId = this.shadow.querySelector('#roi-id').value
    const regionName = this.shadow.querySelector('#area-name').value
    const objects = []

    this.shadow.querySelectorAll('input[name="objects"]').forEach(object => {
      if (object.checked) objects.push(object.value)
    })

    if (regionName === '' || objects.length === 0) {
      document.dispatchEvent(new CustomEvent('message', {
        detail: {
          message: 'Debe completar todos los campos',
          type: 'error'
        }
      }))
      return
    }

    const data = {
      id: roiId || null,
      regionName,
      objects,
      region: this.points
    }

    const endpoint = roiId ? this.updateEndpoint : this.storeEndpoint
    const method = roiId ? 'PUT' : 'POST'

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.status === 200) {
        const regionOfInterest = await response.json()

        if (roiId) {
          this.regionsOfInterest = this.regionsOfInterest.map(region => region.id === regionOfInterest.id ? regionOfInterest : region)
        } else {
          this.regionsOfInterest.push(regionOfInterest)
        }

        this.removeLastCanvasPoints()
        this.renderList()

        document.dispatchEvent(new CustomEvent('message', {
          detail: {
            message: 'Area de interés guardada correctamente',
            type: 'success'
          }
        }))

        this.shadow.querySelector('.roi-selection-area-form-overlay').classList.remove('active')

        this.shadow.querySelector('#roi-id').value = ''
        this.shadow.querySelector('#area-name').value = ''
        this.shadow.querySelectorAll('input[name="objects"]').forEach(object => {
          object.checked = false
        })
      } else {
        document.dispatchEvent(new CustomEvent('message', {
          detail: {
            message: 'Error al guardar el area de interés',
            type: 'error'
          }
        }))
      }
    } catch (error) {
      document.dispatchEvent(new CustomEvent('message', {
        detail: {
          message: 'Fallo al guardar el area de interés',
          type: 'error'
        }
      }))
    }
  }

  cancelRegion () {
    this.removeLastCanvasPoints()
    this.shadow.querySelector('.roi-selection-area-form-overlay').classList.remove('active')

    this.shadow.querySelector('.roi-selection-area-form-overlay').classList.remove('active')

    this.shadow.querySelector('#roi-id').value = ''
    this.shadow.querySelector('#area-name').value = ''
    this.shadow.querySelectorAll('input[name="objects"]').forEach(object => {
      object.checked = false
    })
  }

  async viewRegionOfInterest (id) {
    const regionOfInterest = this.regionsOfInterest.find(regionOfInterest => regionOfInterest.id === id)
    const form = this.shadow.querySelector('.roi-selection-area-form-overlay')
    form.classList.add('active')

    const roiId = form.querySelector('#roi-id')
    const regionName = form.querySelector('#area-name')
    const objects = form.querySelectorAll('input[name="objects"]')

    roiId.value = regionOfInterest.id
    regionName.value = regionOfInterest.regionName
    regionOfInterest.objects.forEach(object => {
      objects.forEach(element => {
        if (element.value === object) {
          element.checked = true
        }
      })
    })

    this.points = regionOfInterest.region
  }

  async deleteRegionOfInterest (id) {
    const response = await fetch(this.deleteEndpoint + '&roiId=' + id, {
      method: 'DELETE'
    })

    if (response.status === 200) {
      this.regionsOfInterest = this.regionsOfInterest.filter(regionOfInterest => regionOfInterest.id !== id)
      this.removeLastCanvasPoints()
      this.regionsOfInterest.forEach(regionOfInterest => this.drawRegion(regionOfInterest))
      this.renderList()

      document.dispatchEvent(new CustomEvent('message', {
        detail: {
          message: 'Area de interés eliminada correctamente',
          type: 'success'
        }
      }))
    } else {
      document.dispatchEvent(new CustomEvent('message', {
        detail: {
          message: 'Error al eliminar el area de interés',
          type: 'error'
        }
      }))
    }
  }

  drawPoint (x, y) {
    const canvas = this.shadow.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'green'
    ctx.beginPath()
    ctx.arc(x, y, 5, 0, 2 * Math.PI)
    ctx.fill()
  }

  drawRegion (regionOfInterest) {
    const canvas = this.shadow.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)'
    ctx.strokeStyle = 'red'
    ctx.beginPath()
    ctx.moveTo(regionOfInterest.region[0].x, regionOfInterest.region[0].y)
    regionOfInterest.region.forEach(point => ctx.lineTo(point.x, point.y))
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = 'red'
    ctx.font = '15px Lato'
    ctx.textAlign = 'center'
    ctx.fillText(regionOfInterest.regionName, regionOfInterest.region[0].x + (regionOfInterest.region[2].x - regionOfInterest.region[0].x) / 2, regionOfInterest.region[0].y + (regionOfInterest.region[2].y - regionOfInterest.region[0].y) / 2)
  }

  removeLastCanvasPoints () {
    this.points = []

    const canvas = this.shadow.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height)

    this.regionsOfInterest.forEach(regionOfInterest => this.drawRegion(regionOfInterest))
  }

  closeGallery () {
    this.points = []
    this.regionsOfInterest = []
    this.image = null

    const canvas = this.shadow.querySelector('canvas')
    const ctx = canvas.getContext('2d')
    ctx.beginPath()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.render()
  }
}

customElements.define('roi-selection-component', RoiSelection)
