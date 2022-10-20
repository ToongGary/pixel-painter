class PixelPainter {
  private drawCanvas: HTMLCanvasElement
  private drawCanvasContext: CanvasRenderingContext2D
  private backgroundCanvas: HTMLCanvasElement
  private colorsDiv: HTMLDivElement
  private resetButton: HTMLButtonElement
  
  private canvasColumnCount: number
  private canvasRowCount: number
  private canvasCellWidth: number
  private canvasCellHeight: number
  private canvasWidth: number
  private canvasHeight: number

  private isClick: boolean

  private cellColor: string

  private canvasWrapper: HTMLDivElement

  constructor({
    canvasId,
    resetButtonId,
    canvasColumnCount,
    canvasRowCount,
    canvasCellWidth,
    canvasCellHeight
  }: {
    canvasId: string
    resetButtonId: string
    canvasColumnCount: number
    canvasRowCount: number
    canvasCellWidth: number
    canvasCellHeight: number
  }) {
    this.cellColor = 'black'
    this.isClick = false
    this.canvasWrapper = document.getElementById(canvasId) as HTMLDivElement
    this.resetButton = document.getElementById(resetButtonId) as HTMLButtonElement
    this.canvasColumnCount = canvasColumnCount
    this.canvasRowCount = canvasRowCount
    this.canvasCellWidth = canvasCellWidth
    this.canvasCellHeight = canvasCellHeight

    this.canvasWidth = this.canvasCellWidth * this.canvasColumnCount
    this.canvasHeight = this.canvasCellHeight * this.canvasRowCount

    this.drawCanvas = this.generateDrawCanvasElement()
    this.drawCanvasContext = this.drawCanvas.getContext('2d') as CanvasRenderingContext2D

    this.backgroundCanvas = this.generateBackgroundCanvasElement()

    this.colorsDiv = this.generateColorsElement()

    const div = document.createElement('div')
    div.appendChild(this.backgroundCanvas)
    div.appendChild(this.drawCanvas)
    this.canvasWrapper.appendChild(div)
    this.canvasWrapper.appendChild(this.colorsDiv)

    this.initializeHandleEvents()
  }

  generateDrawCanvasElement() {
    const canvas = document.createElement('canvas')
    canvas.style.cursor = 'pointer'
    canvas.style.backgroundColor = 'trasnparent'
    canvas.width = this.canvasWidth
    canvas.height = this.canvasHeight
    return canvas
  }

  generateBackgroundCanvasElement() {
    const backgroundCanvas = document.createElement('canvas')
    this.canvasWrapper.style.position = 'relative'
    backgroundCanvas.style.position = 'absolute'
    backgroundCanvas.style.zIndex = '-1'
    backgroundCanvas.style.top = '0'
    backgroundCanvas.style.left = '0'
    backgroundCanvas.width = this.canvasWidth
    backgroundCanvas.height = this.canvasHeight
    this.canvasWrapper.appendChild(backgroundCanvas)

    const backgroundCanvasContext = backgroundCanvas.getContext('2d') as CanvasRenderingContext2D

    for (let y = 0; y < this.canvasRowCount; y++) {
      for (let x = 0; x < this.canvasColumnCount; x++) {
        const cellIndex = x * this.canvasColumnCount + y
        const cellColor = cellIndex % 2 === 0 ? '#e6e6e6' : '#f8f8f8'
        backgroundCanvasContext.fillStyle = cellColor
        backgroundCanvasContext.fillRect(
          x * this.canvasCellWidth,
          y * this.canvasCellHeight,
          this.canvasCellWidth,
          this.canvasCellHeight
        )
      }
    }

    return backgroundCanvas
  }

  generateColorsElement() {
    const colors = ['black', 'red', 'blue', 'green', 'yellow']

    const colorWrapperDiv = document.createElement('div')
    colorWrapperDiv.style.display = 'flex'
    colorWrapperDiv.style.flexFlow = 'row nowrap'
    colorWrapperDiv.style.marginTop = '30px'

    colors.forEach((color) => {
      const colorDiv = document.createElement('div')
      colorDiv.style.width = '30px'
      colorDiv.style.height = '30px'
      colorDiv.style.marginRight = '3px'
      colorDiv.style.backgroundColor = color
      colorDiv.style.cursor = 'pointer'

      const attributes = document.createAttribute('data-color')
      attributes.value = color
      colorDiv.setAttributeNode(attributes)
      colorWrapperDiv.appendChild(colorDiv)
    })

    const label = document.createElement('label')
    label.style.display = 'block'
    label.style.width = '30px'
    label.style.height = '30px'
    label.style.backgroundColor = 'skyblue'
    label.style.position = 'relative'
    const input = document.createElement('input')
    input.type = 'color'
    input.style.position = 'absolute'
    input.style.visibility = 'hidden'
    input.style.width = '100%'
    input.style.display = 'block'
    input.style.height = '100%'
    input.value = '#87ceeb'
    input.addEventListener('input', this.handleColorPickerChanging.bind(this))
    label.appendChild(input)

    colorWrapperDiv.appendChild(label)

    return colorWrapperDiv
  }

  handleColorPickerChanging(event: Event) {
    const target = event.target as HTMLInputElement
    const parent = target.parentElement as HTMLLabelElement
    parent.style.backgroundColor = target.value as string
    this.cellColor = target.value as string
  }

  initializeHandleEvents() {
    this.drawCanvas.addEventListener('mousedown', this.handleCanvasMousedown.bind(this))
    this.drawCanvas.addEventListener('mouseup', this.handleCanvasMouseup.bind(this))
    this.drawCanvas.addEventListener('contextmenu', (event) => event.preventDefault())
    this.drawCanvas.addEventListener('mousemove', this.handleCanvasMouseMove.bind(this))
    this.colorsDiv.addEventListener('mousedown', this.handleColorMousedown.bind(this))

    if (this.resetButton) this.resetButton.addEventListener('click', this.handleResetButtonClick.bind(this))
  }

  handleResetButtonClick() {
    this.drawCanvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

  handleColorMousedown(event: MouseEvent) {
    const target = event.target as HTMLElement
    let color: string
    if (target.tagName == 'LABEL') {
      const input = target.firstChild as HTMLInputElement
      color = input.value as string
    } else {
      color = target.dataset.color as string
    }
    this.cellColor = color
  }

  handleCanvasMousedown(event: MouseEvent) {
    this.isClick = true
    const { x, y } = this.getCellCoordinate(event.clientX, event.clientY)

    if (event.which === 3) {
      this.removeCell(x, y)
    } else {
      this.fillCell(x, y)
    }
  }

  handleCanvasMouseup(event: MouseEvent) {
    this.isClick = false
  }

  handleCanvasMouseMove(event: MouseEvent) {
    if (!this.isClick) return
    const { x, y } = this.getCellCoordinate(event.clientX, event.clientY)

    if (event.which === 3) {
      this.removeCell(x, y)
    } else {
      this.fillCell(x, y)
    }
  }

  getCellCoordinate(clientX: number, clientY: number) {
    const { left: canvasLeft, top: canvasTop } = this.drawCanvas.getBoundingClientRect()
    const x = clientX - canvasLeft
    const y = clientY - canvasTop

    const cellX = Math.floor(x / this.canvasCellWidth)
    const cellY = Math.floor(y / this.canvasCellHeight)

    return { x: cellX, y: cellY }
  }

  fillCell(cellX: number, cellY: number) {
    const startX = cellX * this.canvasCellWidth
    const startY = cellY * this.canvasCellHeight
    this.drawCanvasContext.fillStyle = this.cellColor
    this.drawCanvasContext.fillRect(startX, startY, this.canvasCellWidth, this.canvasCellWidth)
  }

  removeCell(cellX: number, cellY: number) {
    const startX = cellX * this.canvasCellWidth
    const startY = cellY * this.canvasCellHeight
    this.drawCanvasContext.clearRect(startX, startY, this.canvasCellWidth, this.canvasCellHeight)
  }
}
