import Canvas from './components/Canvas'
import ColorPalette from './components/ColorPalette'
import Reset from './components/Reset'

function App() {
  return (
    <div className="pixel-painter">
      <Canvas
        canvasColumnCount={21}
        canvasRowCount={21}
        canvasCellWidth={14}
        canvasCellHeight={14}
      />
      <ColorPalette />
      <Reset></Reset>
    </div>
  )
}

export default App
