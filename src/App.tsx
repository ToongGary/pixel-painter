import Canvas from './components/Canvas'
import ColorPalette from './components/ColorPalette'
import ColorPicker from './components/ColorPicker'
import Reset from './components/Reset'
import './styles/common.css'

function App() {
  return (
    <div className="pixel-painter">
      <Canvas
        canvasColumnCount={21}
        canvasRowCount={21}
        canvasCellWidth={14}
        canvasCellHeight={14}
      />
      <ColorPicker />
      <ColorPalette />
      <Reset />
    </div>
  )
}

export default App
