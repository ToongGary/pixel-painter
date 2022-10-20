class PixelPainter {
  private drawCanvas: HTMLCanvasElement
  private drawCanvasContext: CanvasRenderingContext2D
  private backgroundCanvas: HTMLCanvasElement
  private colorsDiv: HTMLDivElement
  private columnCount: number
  private rowCount: number
  private cellWidth: number
  private cellHeight: number

  private canvasWidth: number
  private canvasHeight: number

  private isClick: boolean

  private cellColor: string

  private wrapper: HTMLDivElement

  constructor({
    wrapperId,
    columnCount,
    rowCount,
    cellWidth,
    cellHeight
  }: {
    wrapperId: string
    columnCount: number
    rowCount: number
    cellWidth: number
    cellHeight: number
  }) {
    this.cellColor = 'black'
    this.isClick = false
    this.wrapper = document.getElementById(wrapperId) as HTMLDivElement
    this.columnCount = columnCount
    this.rowCount = rowCount
    this.cellWidth = cellWidth
    this.cellHeight = cellHeight

    this.canvasWidth = this.cellWidth * this.columnCount
    this.canvasHeight = this.cellHeight * this.rowCount

    this.drawCanvas = this.generateDrawCanvasElement()
    this.drawCanvasContext = this.drawCanvas.getContext('2d') as CanvasRenderingContext2D

    this.backgroundCanvas = this.generateBackgroundCanvasElement()

    this.colorsDiv = this.generateColorsElement()

    const div = document.createElement('div')
    div.appendChild(this.backgroundCanvas)
    div.appendChild(this.drawCanvas)
    this.wrapper.appendChild(div)
    this.wrapper.appendChild(this.colorsDiv)

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
    this.wrapper.style.position = 'relative'
    backgroundCanvas.style.position = 'absolute'
    backgroundCanvas.style.zIndex = '-1'
    backgroundCanvas.style.top = '0'
    backgroundCanvas.style.left = '0'
    backgroundCanvas.width = this.canvasWidth
    backgroundCanvas.height = this.canvasHeight
    this.wrapper.appendChild(backgroundCanvas)

    const backgroundCanvasContext = backgroundCanvas.getContext('2d') as CanvasRenderingContext2D

    for (let y = 0; y < this.rowCount; y++) {
      for (let x = 0; x < this.columnCount; x++) {
        const cellIndex = x * this.columnCount + y
        const cellColor = cellIndex % 2 === 0 ? '#e6e6e6' : '#f8f8f8'
        backgroundCanvasContext.fillStyle = cellColor
        backgroundCanvasContext.fillRect(
          x * this.cellWidth,
          y * this.cellHeight,
          this.cellWidth,
          this.cellHeight
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

    const cellX = Math.floor(x / this.cellWidth)
    const cellY = Math.floor(y / this.cellHeight)

    return { x: cellX, y: cellY }
  }

  fillCell(cellX: number, cellY: number) {
    const startX = cellX * this.cellWidth
    const startY = cellY * this.cellHeight
    this.drawCanvasContext.fillStyle = this.cellColor
    this.drawCanvasContext.fillRect(startX, startY, this.cellWidth, this.cellWidth)
  }

  removeCell(cellX: number, cellY: number) {
    const startX = cellX * this.cellWidth
    const startY = cellY * this.cellHeight
    this.drawCanvasContext.clearRect(startX, startY, this.cellWidth, this.cellHeight)
  }
}
