import '../styles/canvas.css'
import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { setClear } from '../reducers/canvas'

interface CanvasProps {
  canvasColumnCount: number
  canvasRowCount: number
  canvasCellWidth: number
  canvasCellHeight: number
}

function Canvas({
  canvasColumnCount,
  canvasRowCount,
  canvasCellWidth,
  canvasCellHeight
}: CanvasProps) {
  const canvasWidth = canvasCellWidth * canvasColumnCount
  const canvasHeight = canvasCellHeight * canvasRowCount

  const style = {
    width: canvasWidth + 'px',
    height: canvasHeight + 'px'
  }

  return (
    <div className="canvas" style={style}>
      <BackgroundCanvas
        canvasColumnCount={canvasColumnCount}
        canvasRowCount={canvasRowCount}
        canvasCellWidth={canvasCellWidth}
        canvasCellHeight={canvasCellHeight}
      />
      <DrawCanvas
        canvasColumnCount={canvasColumnCount}
        canvasRowCount={canvasRowCount}
        canvasCellWidth={canvasCellWidth}
        canvasCellHeight={canvasCellHeight}
      />
    </div>
  )
}

function BackgroundCanvas({
  canvasColumnCount,
  canvasRowCount,
  canvasCellWidth,
  canvasCellHeight
}: CanvasProps) {
  const backgroundCanvasRef = React.useRef<HTMLCanvasElement>(null)
  const canvasWidth = canvasCellWidth * canvasColumnCount
  const canvasHeight = canvasCellHeight * canvasRowCount

  useEffect(() => {
    const backgroundCanvasContext = backgroundCanvasRef.current?.getContext(
      '2d'
    ) as CanvasRenderingContext2D

    for (let y = 0; y < canvasRowCount; y++) {
      for (let x = 0; x < canvasColumnCount; x++) {
        const cellIndex = x * canvasColumnCount + y
        const cellColor = cellIndex % 2 === 0 ? '#e6e6e6' : '#f8f8f8'
        backgroundCanvasContext.fillStyle = cellColor
        backgroundCanvasContext.fillRect(
          x * canvasCellWidth,
          y * canvasCellHeight,
          canvasCellWidth,
          canvasCellHeight
        )
      }
    }
  }, [])

  return (
    <canvas
      className={'background-canvas'}
      ref={backgroundCanvasRef}
      width={canvasWidth}
      height={canvasHeight}
    ></canvas>
  )
}

function DrawCanvas({
  canvasColumnCount,
  canvasRowCount,
  canvasCellWidth,
  canvasCellHeight
}: CanvasProps) {
  const clear = useAppSelector((state) => state.canvas.clear)
  const currentColor = useAppSelector((state) => state.color.color)
  const dispatch = useAppDispatch()
  const canvasWidth = canvasCellWidth * canvasColumnCount
  const canvasHeight = canvasCellHeight * canvasRowCount
  let isHoldDown = false

  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!clear) return
    clearAll()
  }, [clear])

  return (
    <canvas
      ref={canvasRef}
      className={'draw-canvas'}
      width={canvasWidth}
      height={canvasHeight}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseOut={onMouseOut}
      onMouseDown={onMouseDown}
      onContextMenu={onMouseDown}
    />
  )

  function onMouseDown(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault()
    isHoldDown = true
    const isRightClick = event.buttons === 2
    handleCell(event.clientX, event.clientY, isRightClick, event.target as Element)
  }

  function onMouseMove(event: React.MouseEvent<HTMLElement>) {
    if (!isHoldDown) return
    const isRightClick = event.buttons === 2
    handleCell(event.clientX, event.clientY, isRightClick, event.target as Element)
  }

  function onMouseUp() {
    isHoldDown = false
  }

  function onMouseOut() {
    isHoldDown = false
  }

  function handleCell(clientX: number, clientY: number, isRightClick: boolean, canvas: Element) {
    const { left: canvasLeft, top: canvasTop } = canvas.getBoundingClientRect()
    const cellX = Math.floor((clientX - canvasLeft) / canvasCellWidth)
    const cellY = Math.floor((clientY - canvasTop) / canvasCellHeight)

    if (isRightClick) {
      removeCell(cellX, cellY, canvas as HTMLCanvasElement)
    } else {
      fillCell(cellX, cellY, canvas as HTMLCanvasElement)
    }
  }

  function fillCell(cellX: number, cellY: number, canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    const startX = cellX * canvasCellWidth
    const startY = cellY * canvasCellHeight
    context.fillStyle = currentColor
    context.fillRect(startX, startY, canvasCellWidth, canvasCellWidth)
  }

  function removeCell(cellX: number, cellY: number, canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d') as CanvasRenderingContext2D
    const startX = cellX * canvasCellWidth
    const startY = cellY * canvasCellHeight
    context.clearRect(startX, startY, canvasCellWidth, canvasCellHeight)
  }

  function clearAll() {
    const context = canvasRef.current?.getContext('2d') as CanvasRenderingContext2D
    context.clearRect(0, 0, canvasWidth, canvasHeight)
    dispatch(setClear(false))
  }
}

export default Canvas
