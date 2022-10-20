class PixelPainter {
  private drawCanvas: HTMLCanvasElement
  private drawCanvasContext: CanvasRenderingContext2D
  private backgroundCanvas: HTMLCanvasElement
  private resetButton: HTMLButtonElement
  
  private canvasColumnCount: number
  private canvasRowCount: number
  private canvasCellWidth: number
  private canvasCellHeight: number
  private canvasWidth: number
  private canvasHeight: number

  private colorPaletteElement: HTMLElement | undefined
  private currentColorElement: HTMLElement | undefined

  private isClick: boolean

  private cellColor: string

  private canvasWrapper: HTMLDivElement

  constructor({
    canvasId,
    resetButtonId,
    canvasColumnCount,
    canvasRowCount,
    canvasCellWidth,
    canvasCellHeight,
    colorPaletteId,
    colorPaletteColors,
    currentColorId,
  }: {
    canvasId: string
    resetButtonId: string
    canvasColumnCount: number
    canvasRowCount: number
    canvasCellWidth: number
    canvasCellHeight: number
    colorPaletteId: string
    colorPaletteColors: string[],
    currentColorId: string
  }) {
    this.cellColor = 'black'
    this.isClick = false

    this.canvasWrapper = document.getElementById(canvasId) as HTMLDivElement
    this.canvasColumnCount = canvasColumnCount
    this.canvasRowCount = canvasRowCount
    this.canvasCellWidth = canvasCellWidth
    this.canvasCellHeight = canvasCellHeight
    this.canvasWidth = this.canvasCellWidth * this.canvasColumnCount
    this.canvasHeight = this.canvasCellHeight * this.canvasRowCount
    
    this.colorPaletteElement = this.generateColorPaletteElement(colorPaletteId, colorPaletteColors)
    this.currentColorElement = this.generateCurrentColorElement(currentColorId)

    this.resetButton = document.getElementById(resetButtonId) as HTMLButtonElement

    this.drawCanvas = this.generateDrawCanvasElement()
    this.drawCanvasContext = this.drawCanvas.getContext('2d') as CanvasRenderingContext2D
    this.backgroundCanvas = this.generateBackgroundCanvasElement()

    const div = document.createElement('div')
    div.appendChild(this.backgroundCanvas)
    div.appendChild(this.drawCanvas)
    this.canvasWrapper.appendChild(div)

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

  generateCurrentColorElement(
    currentColorId: string
  ): HTMLElement | undefined {

    const currentColorElement = document.getElementById(currentColorId)
    if (!currentColorElement) return

    const absolutePosition = `
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
    `

    const label = document.createElement('label')
    label.style.cssText = `
      background-color: ${this.cellColor};
      ${absolutePosition}
    `

    const input = document.createElement('input')
    input.type = 'color'
    input.value = this.cellColor
    input.style.cssText = `
      visibility: hidden;
      ${absolutePosition}
    `

    label.appendChild(input)
    currentColorElement.appendChild(label)

    return currentColorElement
  }

  generateColorPaletteElement(
    colorPaletteId: string,
    colorPaletteColors: string[]
  ): HTMLElement | undefined {
    const colorPaletteElement = document.getElementById(colorPaletteId)
    if (!colorPaletteElement) return

    colorPaletteColors.forEach((color) => {
      const colorElement = document.createElement('div')
      colorElement.style.backgroundColor = color

      const attributes = document.createAttribute('data-color')
      attributes.value = color
      colorElement.setAttributeNode(attributes)
      colorPaletteElement.appendChild(colorElement)
    })

    return colorPaletteElement
  }

  initializeHandleEvents() {
    this.drawCanvas.addEventListener('mousedown', this.handleCanvasMousedown.bind(this))
    this.drawCanvas.addEventListener('mouseup', this.handleCanvasMouseup.bind(this))
    this.drawCanvas.addEventListener('contextmenu', (event) => event.preventDefault())
    this.drawCanvas.addEventListener('mousemove', this.handleCanvasMouseMove.bind(this))

    if (this.colorPaletteElement) {
      this.colorPaletteElement.addEventListener('click', this.handleColorPaletteClick.bind(this))
    }

    if (this.currentColorElement) {
      const input = this.currentColorElement.querySelector('input') as HTMLInputElement
      input.addEventListener('input', this.handleCurrentColorPicker.bind(this))
    }

    if (this.resetButton) {
      this.resetButton.addEventListener('click', this.handleResetButtonClick.bind(this))
    }
  }

  handleCurrentColorPicker(event: Event) {
    const target = event.target as HTMLInputElement
    const parent = target.parentElement as HTMLLabelElement
    parent.style.backgroundColor = target.value as string
    this.cellColor = target.value as string
  }

  handleResetButtonClick() {
    this.drawCanvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
  }

  handleColorPaletteClick(event: MouseEvent) {
    const target = event.target as HTMLElement
    const color = target.dataset.color as string

    if (this.currentColorElement) {
      const label = this.currentColorElement.querySelector('label') as HTMLLabelElement
      label.style.backgroundColor = color

      const input = this.currentColorElement.querySelector('input') as HTMLInputElement
      input.value = color
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
