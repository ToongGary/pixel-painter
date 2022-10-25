import Canvas from './components/Canvas'
import ColorPalette from './components/ColorPalette'
import ColorPicker from './components/ColorPicker'
import Reset from './components/Reset'
import './styles/common.css'

function App() {
  return (
    <div className="pixel-painter">
      <div>
        <Canvas
          canvasColumnCount={21}
          canvasRowCount={21}
          canvasCellWidth={20}
          canvasCellHeight={20}
        />
        <div>
          <div className={'toolbar'}>
            <ColorPicker />
            <Reset />
          </div>
          <ColorPalette />
        </div>
      </div>
    </div>
  )
}

export default App
