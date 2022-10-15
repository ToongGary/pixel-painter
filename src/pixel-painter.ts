class PixelPainter {
  private drawCanvas: HTMLCanvasElement
  private drawCanvasContext: CanvasRenderingContext2D
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

    this.wrapper.appendChild(this.drawCanvas)
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
}
