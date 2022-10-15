class PixelPainter {
  private drawCanvas: HTMLCanvasElement
  private drawCanvasContext: CanvasRenderingContext2D
  private backgroundCanvas: HTMLCanvasElement
  private columnCount: number
  private rowCount: number
  private cellWidth: number
  private cellHeight: number

  private wrapper: HTMLDivElement

  constructor({
    wrapperId,
    columnCount,
    rowCount
  }: {
    wrapperId: string
    columnCount: number
    rowCount: number
  }) {
    this.wrapper = document.getElementById(wrapperId) as HTMLDivElement
    this.columnCount = columnCount
    this.rowCount = rowCount

    this.drawCanvas = this.generateDrawCanvasElement()
    this.drawCanvasContext = this.drawCanvas.getContext('2d') as CanvasRenderingContext2D
    this.cellWidth = this.drawCanvas.width / this.columnCount
    this.cellHeight = this.drawCanvas.height / this.rowCount

    this.backgroundCanvas = this.generateBackgroundCanvasElement()

    this.wrapper.appendChild(this.drawCanvas)
    this.wrapper.appendChild(this.backgroundCanvas)

    this.initializeHandleEvents()
  }

  generateDrawCanvasElement() {
    const canvas = document.createElement('canvas')
    canvas.style.cursor = 'pointer'
    canvas.style.backgroundColor = 'trasnparent'
    canvas.style.width = this.wrapper.clientWidth + 'px'
    canvas.style.height = this.wrapper.clientHeight + 'px'
    canvas.width = this.wrapper.clientWidth
    canvas.height = this.wrapper.clientHeight
    return canvas
  }

  generateBackgroundCanvasElement() {
    const backgroundCanvas = document.createElement('canvas')
    this.wrapper.style.position = 'relative'
    backgroundCanvas.style.position = 'absolute'
    backgroundCanvas.style.zIndex = '-1'
    backgroundCanvas.style.top = '0'
    backgroundCanvas.style.left = '0'
    backgroundCanvas.style.width = '100%'
    backgroundCanvas.style.height = '100%'
    backgroundCanvas.width = this.wrapper.clientWidth
    backgroundCanvas.height = this.wrapper.clientHeight
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

  initializeHandleEvents() {
    this.drawCanvas.addEventListener('mousedown', this.handleCanvasClick.bind(this))
  }

  handleCanvasClick(event: MouseEvent) {
    const { left: canvasLeft, top: canvasTop } = this.drawCanvas.getBoundingClientRect()
    const x = event.clientX - canvasLeft
    const y = event.clientY - canvasTop

    const cellX = Math.floor(x / this.cellWidth)
    const cellY = Math.floor(y / this.cellHeight)

    this.fillCell(cellX, cellY)
  }

  fillCell(cellX: number, cellY: number) {
    this.drawCanvasContext.fillStyle = 'black'

    const startX = cellX * this.cellWidth
    const startY = cellY * this.cellHeight

    this.drawCanvasContext.fillRect(startX, startY, this.cellWidth, this.cellWidth)
  }
}
